import { SignInPage } from "@toolpad/core/SignInPage";
import Link from "@mui/material/Link";
import { useNavigate } from "react-router-dom";

/** Hooks **/
import { useSession } from "../hooks/useSession";

/** Services **/
import { getAuthToken } from "../services/Auth/authToken";

/** API **/
import { loginUser } from "../api/users/loginUser";

const SignUpLink = () => {
    return (
        <span style={{ fontSize: "0.8rem" }}>
            Don&apos;t have an account?&nbsp;<Link href="/register">Sign up</Link>
        </span>
    );
};

const SignIn = () => {
    const { setSession } = useSession();
    const navigate = useNavigate();
    const providers = [{ id: "credentials", name: "Email and Password" }];

    const handleSignIn = async (email, password) => {
        const response = await loginUser({ email, password });
        if (response) {
            const authToken = response.token;
            if (!authToken) {
                throw new Error("Sign in failed");
            }

            const { username, email, id: userId } = response.user;
            const token = getAuthToken(authToken);
            if (token) {
                return {
                    user: {
                        id: userId,
                        name: username,
                        email: email,
                        token: token,
                    },
                };
            }
        }
        throw new Error("Failed to login");
    };

    return (
        <SignInPage
            providers={providers}
            signIn={async (provider, formData, callbackUrl) => {
                try {
                    const email = formData.get("email");
                    const password = formData.get("password");
                    const session = await handleSignIn(email, password);
                    if (session) {
                        setSession(session);
                        navigate(callbackUrl || "/", { replace: true });
                        return {};
                    }
                } catch (error) {
                    return {
                        error: error instanceof Error ? error.message : "An error occurred",
                    };
                }
                return {};
            }}
            slots={{
                signUpLink: SignUpLink,
            }}
        />
    );
};

export default SignIn;
