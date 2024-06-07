import React, { useContext } from 'react';
import {
    Avatar,
    Flex,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    useColorModeValue
} from '@chakra-ui/react';
import { UserContext } from 'contexts/UserContext';
import { SearchBar } from 'components/navbar/searchBar/SearchBar';
import { SidebarResponsive } from 'components/sidebar/Sidebar';
import PropTypes from 'prop-types';
import routes from 'routes.js';
import { ThemeEditor } from './ThemeEditor';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants';

const logout = async () => {
    try {
        localStorage.removeItem(ACCESS_TOKEN);
        localStorage.removeItem(REFRESH_TOKEN);
        window.location.href = '/';
    } catch (error) {
        console.error('Logout failed:', error);
    }
};

export default function HeaderLinks({ secondary, searchQuery, handleSearch }) {
    const { user } = useContext(UserContext);

    const navbarIcon = useColorModeValue('gray.400', 'white');
    const menuBg = useColorModeValue('white', 'navy.800');
    const textColor = useColorModeValue('secondaryGray.900', 'white');
    const borderColor = useColorModeValue('#E6ECFA', 'rgba(135, 140, 189, 0.3)');
    const shadow = useColorModeValue(
        '14px 17px 40px 4px rgba(112, 144, 176, 0.18)',
        '14px 17px 40px 4px rgba(112, 144, 176, 0.06)'
    );

    return (
        <Flex
            w={{ sm: '100%', md: 'auto' }}
            alignItems="center"
            flexDirection="row"
            bg={menuBg}
            flexWrap={secondary ? { base: 'wrap', md: 'nowrap' } : 'unset'}
            p="10px"
            borderRadius="30px"
            boxShadow={shadow}
        >
            <SearchBar
                mb={secondary ? { base: '10px', md: 'unset' } : 'unset'}
                me="10px"
                borderRadius="30px"
                placeholder="Search..."
                onSearch={handleSearch}
                value={searchQuery}
            />
            <SidebarResponsive routes={routes} />
            <Flex alignItems="center" mx="10px">
                <ThemeEditor navbarIcon={navbarIcon} />
            </Flex>
            <Menu>
                <MenuButton p="0px">
                    <Avatar
                        _hover={{ cursor: 'pointer' }}
                        color="white"
                        bg="#11047A"
                        size="sm"
                        w="40px"
                        h="40px"
                        src={user?.profile?.picture || ''}
                    />
                </MenuButton>
                <MenuList
                    boxShadow={shadow}
                    p="0px"
                    mt="10px"
                    borderRadius="20px"
                    bg={menuBg}
                    border="none"
                >
                    <Flex w="100%" mb="0px">
                        <Text
                            ps="20px"
                            pt="16px"
                            pb="10px"
                            w="100%"
                            borderBottom="1px solid"
                            borderColor={borderColor}
                            fontSize="sm"
                            fontWeight="700"
                            color={textColor}
                        >
                            👋&nbsp; Hey, {user?.username || 'Guest'}
                        </Text>
                    </Flex>
                    <Flex flexDirection="column" p="10px">
                        <MenuItem
                            _hover={{ bg: 'none' }}
                            _focus={{ bg: 'none' }}
                            color="red.400"
                            borderRadius="8px"
                            onClick={logout}
                            px="14px"
                        >
                            <Text fontSize="sm">Log out</Text>
                        </MenuItem>
                    </Flex>
                </MenuList>
            </Menu>
        </Flex>
    );
}

HeaderLinks.propTypes = {
    secondary: PropTypes.bool,
    searchQuery: PropTypes.string,
    handleSearch: PropTypes.func
};
