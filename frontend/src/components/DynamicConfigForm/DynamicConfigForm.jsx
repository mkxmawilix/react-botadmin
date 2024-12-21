import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';

const DynamicConfigForm = ({ fields, onSave, onDirtyChange }) => {
    const {
        register,
        handleSubmit,
        formState: { isDirty, errors },
    } = useForm({
        defaultValues: fields.reduce((defaults, field) => {
            defaults[field.name] = field.defaultValue || '';
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


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {fields.map((field) => {
                    switch (field.type) {
                    // TODO other types of fields
                    case 'checkbox':
                        return (
                            <FormControlLabel
                                key={field.name}
                                control={<Checkbox {...register(field.name)} />}
                                label={field.label}
                            />
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
            type: PropTypes.oneOf(['checkbox']).isRequired,
            defaultValue: PropTypes.any,
            validation: PropTypes.object,
        })
    ).isRequired,
    onSave: PropTypes.func.isRequired,
    onDirtyChange: PropTypes.func.isRequired,
};

export { DynamicConfigForm };
