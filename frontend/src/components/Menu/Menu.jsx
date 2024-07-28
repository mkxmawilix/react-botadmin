import { List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Server List', path: '/dashboard/servers' },
        { text: 'Configuration', path: '/dashboard/configuration' },
    ];

    return (
        <List component="nav">
            {menuItems.map((item, index) => (
                <ListItem key={index} onClick={() => navigate(item.path)}>
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    );
};

export { Menu };