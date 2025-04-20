import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const DynamicConfigForm = ({ fields, onSave, onDirtyChange }) => {
    // Create initial values from fields
    const initialValues = fields.reduce((defaults, field) => {
        // Important: Handle special case for array type to prevent "dirty" state at initialization
        if (field.type === "array") {
            defaults[field.name] = field.defaultValue || [];
        } else {
            defaults[field.name] = field.defaultValue || "";
        }
        return defaults;
    }, {});

    const {
        register,
        handleSubmit,
        formState: { isDirty, errors },
        control,
        watch,
    } = useForm({
        defaultValues: initialValues,
    });

    // Store initial values for comparison
    const initialValuesRef = useRef(initialValues);

    // Setup fields array
    const fieldArrays = {};
    fields.forEach((field) => {
        if (field.type === "array") {
            fieldArrays[field.name] = useFieldArray({
                control,
                name: field.name,
            });
        }
    });

    // For adding new items to arrays
    const [newItemValue, setNewItemValue] = useState("");

    // Custom hook to determine if the form is really dirty based on values comparison
    const formValues = watch();
    const [isReallyDirty, setIsReallyDirty] = useState(false);

    useEffect(() => {
        // Compare current values with initial values
        const checkIfReallyDirty = () => {
            for (const field of fields) {
                const fieldName = field.name;
                const initialValue = initialValuesRef.current[fieldName];
                const currentValue = formValues[fieldName];

                if (field.type === "array") {
                    // For arrays, check if length changed or content changed
                    if (!initialValue && currentValue && currentValue.length > 0) {
                        return true;
                    }
                    if (initialValue && (!currentValue || initialValue.length !== currentValue.length)) {
                        return true;
                    }

                    // Compare array contents
                    if (initialValue && currentValue) {
                        for (let i = 0; i < initialValue.length; i++) {
                            if (initialValue[i] !== currentValue[i]) {
                                return true;
                            }
                        }
                    }
                } else if (initialValue !== currentValue) {
                    return true;
                }
            }
            return false;
        };

        const reallyDirty = checkIfReallyDirty();
        if (isReallyDirty !== reallyDirty) {
            setIsReallyDirty(reallyDirty);
            onDirtyChange(reallyDirty);
        }
    }, [formValues, fields, isReallyDirty, onDirtyChange]);

    const onSubmit = (data) => {
        onSave(data);
        // Update initial values reference after save
        initialValuesRef.current = { ...data };
        setIsReallyDirty(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {fields.map((field) => {
                    switch (field.type) {
                        // TODO other types of fields
                        case "checkbox":
                            return (
                                <FormControlLabel
                                    key={field.name}
                                    control={<Checkbox {...register(field.name)} defaultChecked={field.defaultValue} />}
                                    label={field.label}
                                />
                            );
                        case "text":
                            return (
                                <TextField
                                    key={field.name}
                                    label={field.label}
                                    {...register(field.name)}
                                    variant="outlined"
                                    size="small"
                                />
                            );
                        case "integer":
                            return (
                                <TextField
                                    key={field.name}
                                    label={field.label}
                                    type="number"
                                    {...register(field.name, {
                                        valueAsNumber: true,
                                        validate: (value) => {
                                            if (value < 0) {
                                                return "Value must be a positive number";
                                            }
                                            return true;
                                        },
                                    })}
                                    variant="outlined"
                                    size="small"
                                    error={!!errors[field.name]}
                                    helperText={errors[field.name] ? errors[field.name].message : ""}
                                />
                            );
                        case "array": {
                            const { fields: arrayFields, append, remove } = fieldArrays[field.name];
                            return (
                                <Box key={field.name} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1">{field.label}</Typography>
                                    <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                                        <List dense>
                                            {arrayFields.map((item, index) => (
                                                <ListItem
                                                    key={item.id}
                                                    secondaryAction={
                                                        <IconButton edge="end" onClick={() => remove(index)}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    }
                                                >
                                                    <TextField
                                                        fullWidth
                                                        {...register(`${field.name}.${index}`)}
                                                        size="small"
                                                        variant="outlined"
                                                    />
                                                </ListItem>
                                            ))}
                                            {arrayFields.length === 0 && (
                                                <ListItem>
                                                    <Typography variant="body2" color="textSecondary">
                                                        No items added yet
                                                    </Typography>
                                                </ListItem>
                                            )}
                                        </List>
                                    </Paper>
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <TextField
                                            size="small"
                                            label={`Add new ${field.label}`}
                                            value={newItemValue}
                                            onChange={(e) => setNewItemValue(e.target.value)}
                                        />
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                if (newItemValue.trim()) {
                                                    append(newItemValue.trim());
                                                    setNewItemValue("");
                                                }
                                            }}
                                            startIcon={<AddIcon />}
                                        >
                                            Add
                                        </Button>
                                    </Box>
                                </Box>
                            );
                        }
                        default:
                            return null;
                    }
                })}
                <Button type="submit" variant="contained" color="primary" disabled={!isDirty}>
                    Save
                </Button>
            </Box>
        </form>
    );
};

DynamicConfigForm.propTypes = {
    fields: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
            type: PropTypes.oneOf(["checkbox", "text", "integer", "array"]).isRequired,
            defaultValue: PropTypes.any,
            validation: PropTypes.object,
        })
    ).isRequired,
    onSave: PropTypes.func.isRequired,
    onDirtyChange: PropTypes.func.isRequired,
};

export { DynamicConfigForm };
