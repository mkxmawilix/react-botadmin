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
import { useEffect, useMemo, useRef, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

const DynamicConfigForm = ({ fields, onSave, onDirtyChange }) => {
    // Create initial values from fields
    const initialValues = fields.reduce((defaults, field) => {
        // Important: Handle special case for array type to prevent "dirty" state at initialization
        if (field.type === "array") {
            defaults[field.name] = field.defaultValue || [];
        } else if (field.type === "tables") {
            // Handle tables type initialization
            if (field.tables) {
                field.tables.forEach((table, tableIndex) => {
                    table.columns.forEach((column) => {
                        const fieldName = `${field.name}.${tableIndex}.${column.name}`;
                        defaults[fieldName] = column.defaultValue || "";
                    });
                });
            }
        } else if (field.type === "object") {
            // Only set the top-level object field, not individual nested fields
            defaults[field.name] = {};

            // Handle nested fields in objects
            if (field.fields) {
                field.fields.forEach((subField) => {
                    if (subField.type === "tables") {
                        // Handle tables inside objects
                        if (subField.tables) {
                            defaults[field.name][subField.name] = subField.tables.map((table) => {
                                const tableData = {};
                                table.columns.forEach((column) => {
                                    tableData[column.name] = column.defaultValue || "";
                                });
                                return tableData;
                            });
                        }
                    } else {
                        // Handle regular fields inside objects
                        defaults[field.name][subField.name] = subField.defaultValue || "";
                    }
                });
            }
        } else {
            defaults[field.name] = field.defaultValue || "";
        }
        return defaults;
    }, {});

    const {
        register,
        handleSubmit,
        formState: { errors },
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

    // Watch ALL form fields to ensure we capture ALL changes
    const formValues = watch();

    // Track form dirty state
    const [isDirtyForm, setIsDirtyForm] = useState(false);

    // Ref to track previous dirty state to avoid unnecessary updates
    const prevDirtyStateRef = useRef(false);

    // Create a stable stringified version of form values for comparison
    const formValuesString = useMemo(() => {
        return JSON.stringify(formValues);
    }, [formValues]);

    // Compare current form values with initial values to detect changes
    useEffect(() => {
        // Convert initial values to JSON string for comparison (done only when needed)
        const initialValuesJson = JSON.stringify(initialValuesRef.current);
        const dirty = formValuesString !== initialValuesJson;

        // Only update state and notify parent if dirty state actually changed
        if (prevDirtyStateRef.current !== dirty) {
            prevDirtyStateRef.current = dirty;
            setIsDirtyForm(dirty);
            onDirtyChange(dirty);
        }
    }, [formValuesString, onDirtyChange]);

    const onSubmit = (data) => {
        console.log("Form submitted with data:", data);

        // Process the data to fix nested objects if needed
        const processedData = { ...data };

        // Make a deep copy of the submitted data to avoid reference issues
        initialValuesRef.current = JSON.parse(JSON.stringify(processedData));
        setIsDirtyForm(false);
        onDirtyChange(false);

        onSave(processedData);
    };

    // Render tables with extra onChange handler to ensure values are captured
    const renderTableField = (field, tableIndex, column) => {
        // For nested objects like Odoo.odooStages.0.from_stage_id
        const fieldName = field.name.includes(".")
            ? `${field.name}.${tableIndex}.${column.name}`
            : `${field.name}.${tableIndex}.${column.name}`;

        // Handle numeric inputs properly in tables
        const registerOptions =
            column.type === "integer"
                ? {
                      valueAsNumber: true,
                      validate: (value) => {
                          if (value < 0) {
                              return "Value must be a positive number";
                          }
                          return true;
                      },
                  }
                : {};

        return (
            <TextField
                key={column.label}
                fullWidth
                label={column.label}
                type={column.type === "integer" ? "number" : "text"}
                {...register(fieldName, registerOptions)}
                variant="outlined"
                size="small"
                error={!!errors[fieldName]}
                helperText={errors[fieldName] ? errors[fieldName].message : ""}
            />
        );
    };

    // Render a specific field based on its type
    const renderField = (field) => {
        switch (field.type) {
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
            case "password":
                return (
                    <TextField
                        key={field.name}
                        label={field.label}
                        type="password"
                        {...register(field.name)}
                        variant="outlined"
                        size="small"
                    />
                );
            case "object":
                if (!field.fields || field.fields.length === 0) {
                    return null;
                }

                return (
                    <Paper key={field.name} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {field.label}
                        </Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pl: 2 }}>
                            {field.fields.map((subField) => {
                                // Create a copy of the subField with a prefixed name for proper nesting
                                const prefixedField = {
                                    ...subField,
                                    name: `${field.name}.${subField.name}`,
                                };

                                return renderField(prefixedField);
                            })}
                        </Box>
                    </Paper>
                );
            case "tables":
                if (!field.tables || field.tables.length === 0) {
                    return null;
                }

                return (
                    <Paper key={field.name} variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            {field.label}
                        </Typography>
                        {field.tables.map((table, tableIndex) => (
                            <Box key={`${field.name}.${tableIndex}`} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1">{table.name}</Typography>
                                <Paper variant="outlined" sx={{ p: 2, mb: 1 }}>
                                    <List dense>
                                        {table.columns.map((column) => (
                                            <ListItem key={column.label}>
                                                {renderTableField(field, tableIndex, column)}
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                        ))}
                    </Paper>
                );
            default:
                return null;
        }
    };

    // Map over all fields and render them
    const getFormFields = () => {
        return fields.map((field) => renderField(field));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {getFormFields()}
                <Button type="submit" variant="contained" color="primary" disabled={!isDirtyForm}>
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
            type: PropTypes.oneOf(["checkbox", "text", "integer", "array", "password", "object", "tables"]).isRequired,
            defaultValue: PropTypes.any,
            validation: PropTypes.object,
        })
    ).isRequired,
    onSave: PropTypes.func.isRequired,
    onDirtyChange: PropTypes.func.isRequired,
};

export { DynamicConfigForm };
