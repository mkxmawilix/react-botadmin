import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useFieldArray, useForm } from "react-hook-form";
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
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const DynamicConfigForm = ({ fields, onSave, onDirtyChange }) => {
    const {
        register,
        handleSubmit,
        formState: { isDirty, errors },
        control,
        setValue,
        watch,
    } = useForm({
        defaultValues: fields.reduce((defaults, field) => {
            defaults[field.name] = field.defaultValue || "";
            return defaults;
        }, {}),
    });

    const previousIsDirty = useRef(isDirty);
    useEffect(() => {
        if (previousIsDirty.current !== isDirty) {
            onDirtyChange(isDirty);
            previousIsDirty.current = isDirty;
        }
    }, [isDirty, onDirtyChange]);

    const onSubmit = (data) => {
        onSave(data);
    };

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
                                    control={<Checkbox {...register(field.name)} />}
                                    label={field.label}
                                />
                            );
                        case "array":
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
            type: PropTypes.oneOf(["checkbox", "array"]).isRequired,
            defaultValue: PropTypes.any,
            validation: PropTypes.object,
        })
    ).isRequired,
    onSave: PropTypes.func.isRequired,
    onDirtyChange: PropTypes.func.isRequired,
};

export { DynamicConfigForm };
