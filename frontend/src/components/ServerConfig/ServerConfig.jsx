import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Tab,
    Tabs,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

/** Components **/
import DynamicConfigForm from "../DynamicConfigForm";

const ServerConfig = ({ guild }) => {
    const [activeTab, setActiveTab] = useState(0);
    const [isDirty, setIsDirty] = useState(() => guild.cogsSettings.map(() => false));
    const [showDialog, setShowDialog] = useState(false);
    const [pendingTab, setPendingTab] = useState(null);

    const handleTabChange = (event, newValue) => {
        if (isDirty[activeTab]) {
            setShowDialog(true);
            setPendingTab(newValue);
        } else {
            setActiveTab(newValue);
        }
    };

    const confirmTabChange = () => {
        // Reset the dirty state for the current tab when user confirms leaving without saving
        setIsDirty((prev) => {
            const newState = [...prev];
            newState[activeTab] = false;
            return newState;
        });

        setShowDialog(false);
        setActiveTab(pendingTab);
        setPendingTab(null);
    };

    const cancelTabChange = () => {
        setShowDialog(false);
        setPendingTab(null);
    };

    const handleDirtyChange = (index, dirty) => {
        // Form has changed set current tab as dirty
        setIsDirty((prev) => {
            const newState = [...prev];
            newState[index] = dirty;
            return newState;
        });
    };

    const handleSave = (index, data) => {
        // TODO: Apply config changes here
        // Remove dirty state
        setIsDirty((prev) => {
            const newState = [...prev];
            newState[index] = false;
            return newState;
        });
    };

    const buildFieldsListUwu = (settings) => {
        const uwuFieldList = [];
        uwuFieldList.push(
            {
                name: "tenorApiKey",
                label: "Tenor API Key",
                type: "text",
                defaultValue: settings.tenor_apikey || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "tenorUrl",
                label: "Tenor URL",
                type: "text",
                defaultValue: settings.tenor_url || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "tenorLimit",
                label: "Tenor Limit",
                type: "integer",
                defaultValue: settings.tenor_limit || "",
                validation: {
                    required: true,
                },
            }
        );
        return uwuFieldList;
    };

    const buildFieldsListProjectDelivery = (settings) => {
        const projectDeliveryFieldList = [];
        projectDeliveryFieldList.push(
            {
                name: "projectDeliveryChannelId",
                label: "Project Delivery Channel ID",
                type: "text",
                defaultValue: settings.channel_id || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "gitlabUrl",
                label: "Gitlab URL",
                type: "text",
                defaultValue: settings.url || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "gitlabToken",
                label: "Gitlab Token",
                type: "text",
                defaultValue: settings.token || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "gitlabProjectIds",
                label: "Gitlab Project IDs",
                type: "array",
                defaultValue: settings.project_ids || [],
                validation: {
                    required: true,
                },
            },
            {
                name: "Odoo",
                label: "Odoo",
                type: "object",
                fields: [
                    {
                        name: "odooHost",
                        label: "Hostname",
                        type: "text",
                        defaultValue: settings.odoo.hostname || "",
                        validation: {
                            required: true,
                        },
                    },
                    {
                        name: "odooDb",
                        label: "Database",
                        type: "text",
                        defaultValue: settings.odoo.database || "",
                        validation: {
                            required: true,
                        },
                    },
                    {
                        name: "odooPort",
                        label: "Port",
                        type: "integer",
                        defaultValue: settings.odoo.port || "",
                        validation: {
                            required: true,
                        },
                    },
                    {
                        name: "odooUsername",
                        label: "Username",
                        type: "text",
                        defaultValue: settings.odoo.login || "",
                        validation: {
                            required: true,
                        },
                    },
                    {
                        name: "odooPassword",
                        label: "New Password",
                        type: "password",
                        defaultValue: "",
                        validation: {
                            required: false,
                        },
                    },
                    {
                        name: "odooStages",
                        label: "Stages",
                        type: "tables",
                        tables: [
                            {
                                name: "Testing",
                                columns: [
                                    {
                                        name: "from_stage_id",
                                        label: "From Id",
                                        defaultValue: settings.stages.testing.from_stage_id || "",
                                        validation: {
                                            required: true,
                                        },
                                        type: "integer",
                                    },
                                    {
                                        name: "to_stage_id",
                                        label: "To Id",
                                        defaultValue: settings.stages.testing.to_stage_id || "",
                                        validation: {
                                            required: true,
                                        },
                                        type: "integer",
                                    },
                                ],
                            },
                            {
                                name: "Staging",
                                columns: [
                                    {
                                        name: "from_stage_id",
                                        label: "From Id",
                                        defaultValue: settings.stages.staging.from_stage_id || "",
                                        validation: {
                                            required: true,
                                        },
                                        type: "integer",
                                    },
                                    {
                                        name: "to_stage_id",
                                        label: "To Id",
                                        defaultValue: settings.stages.staging.to_stage_id || "",
                                        validation: {
                                            required: true,
                                        },
                                        type: "integer",
                                    },
                                ],
                            },
                            {
                                name: "Production",
                                columns: [
                                    {
                                        name: "from_stage_id",
                                        label: "From Id",
                                        defaultValue: settings.stages.prod.from_stage_id || "",
                                        validation: {
                                            required: true,
                                        },
                                        type: "integer",
                                    },
                                    {
                                        name: "to_stage_id",
                                        label: "To Id",
                                        defaultValue: settings.stages.prod.to_stage_id || "",
                                        validation: {
                                            required: true,
                                        },
                                        type: "integer",
                                    },
                                ],
                            },
                        ],
                    },
                ],
            }
        );
        return projectDeliveryFieldList;
    };

    const buildFieldsListGitlab = (settings) => {
        const gitlabFieldList = [];
        gitlabFieldList.push(
            {
                name: "gitlabUrl",
                label: "Gitlab URL",
                type: "text",
                defaultValue: settings.url || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "gitlabToken",
                label: "Gitlab Token",
                type: "text",
                defaultValue: settings.token || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "gitlabChannelId",
                label: "Gitlab Channel ID",
                type: "text",
                defaultValue: settings.channel_id || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "labelToValidate",
                label: "Label to validate",
                type: "text",
                defaultValue: settings.label_to_validate || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "labelValidated",
                label: "Label validated",
                type: "text",
                defaultValue: settings.label_validated || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "NumberReactionsNeeded",
                label: "Number of reactions needed",
                type: "object",
                fields: [
                    {
                        name: "nbrForApproval",
                        label: "# Approval",
                        type: "integer",
                        defaultValue: settings.nbr_reactions_required.approval || 0,
                        validation: {
                            required: "This field is required",
                            min: { value: 1, message: "The value must be at least 1" },
                        },
                    },
                    {
                        name: "nbrForValidation",
                        label: "# Validation",
                        type: "integer",
                        defaultValue: settings.nbr_reactions_required.validation || 0,
                        validation: {
                            required: "This field is required",
                            min: { value: 1, message: "The value must be at least 1" },
                        },
                    },
                ],
            },
            {
                name: "gitlabToken",
                label: "Gitlab Token",
                type: "text",
                defaultValue: settings.token || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "gitlabUrl",
                label: "Gitlab URL",
                type: "text",
                defaultValue: settings.url || "",
                validation: {
                    required: true,
                },
            },
            {
                name: "gitlabProjectIds",
                label: "Gitlab Project IDs",
                type: "array",
                defaultValue: settings.project_ids || [],
                validation: {
                    required: "At least one project is required",
                    maxLength: { value: 1, message: "Only one project is allowed for now" },
                    validate: {
                        notEmpty: (value) => value.length > 0 || "At least one project is required",
                        maxLength: (value) => value.length <= 1 || "Only one project is allowed for now",
                    },
                },
                // Validation for each item in the array
                itemValidation: {
                    pattern: {
                        value: /^\d+$/,
                        message: "The project ID must be a number",
                    },
                },
            }
        );
        return gitlabFieldList;
    };

    const buildFieldsList = (cogsSettings) => {
        const { settings } = cogsSettings;
        const fieldList = [];
        if (Object.prototype.hasOwnProperty.call(settings, "active")) {
            fieldList.push({
                name: "activeCog",
                label: "Active",
                type: "checkbox",
                defaultValue: "checked" in settings ? settings.checked : settings.active,
                validation: {
                    required: false,
                },
            });
        }
        if (Object.prototype.hasOwnProperty.call(settings, "blocked_channel_ids")) {
            fieldList.push({
                name: "blockedChannelIds",
                label: "Blocked Channel IDs",
                type: "array",
                defaultValue: settings.blocked_channel_ids,
                validation: {
                    required: false,
                },
            });
        }
        if (cogsSettings.name === "Uwu") {
            fieldList.push(...buildFieldsListUwu(settings));
        }
        if (cogsSettings.name === "Project_delivery") {
            fieldList.push(...buildFieldsListProjectDelivery(settings));
        }
        if (cogsSettings.name === "Gitlab") {
            fieldList.push(...buildFieldsListGitlab(settings));
        }
        return fieldList;
    };

    return (
        <Box sx={{ display: "flex", flexGrow: 1, bgcolor: "background.paper", height: "100%" }}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={activeTab}
                onChange={handleTabChange}
                aria-label="Cogs configurations tabs"
                sx={{ borderRight: 1, borderColor: "divider" }}
            >
                {guild.cogsSettings.map((settings, index) => (
                    <Tab key={index} label={settings.name || `Cog ${index + 1}`} />
                ))}
            </Tabs>
            {/* TODO map on transformed object usable by the form */}
            {guild.cogsSettings.map((cogSettings, index) => (
                <Box
                    key={index}
                    role="tabpanel"
                    hidden={activeTab !== index}
                    id={`vertical-tabpanel-${index}`}
                    aria-labelledby={`vertical-tab-${index}`}
                    sx={{ p: 3 }}
                >
                    {activeTab === index && (
                        /* TODO Use new transformed object to send fields to the form */
                        <DynamicConfigForm
                            fields={buildFieldsList(cogSettings)}
                            onSave={(data) => handleSave(index, data)}
                            onDirtyChange={(dirty) => handleDirtyChange(index, dirty)}
                        />
                    )}
                </Box>
            ))}
            <Dialog open={showDialog} onClose={cancelTabChange}>
                <DialogTitle>Unsaved Changes</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You have unsaved changes in the current tab. Are you sure you want to switch tabs without
                        saving?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelTabChange} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={confirmTabChange} color="primary">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

ServerConfig.propTypes = {
    guild: PropTypes.object.isRequired,
};

export { ServerConfig };
