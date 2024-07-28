import { List, ListItem, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Menu = () => {
    const navigate = useNavigate();

    const menuItems = [
        { text: 'Server List', path: '/dashboard/servers' },
    ];

    return (
        <List component="nav">
            {menuItems.map((item, index) => (
                <ListItem button key={index} onClick={() => navigate(item.path)}>
                    <ListItemText primary={item.text} />
                </ListItem>
            ))}
        </List>
    );
};

export { Menu };