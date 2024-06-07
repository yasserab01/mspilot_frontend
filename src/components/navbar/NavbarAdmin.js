// Chakra Imports
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react';
import PropTypes from 'prop-types';
import React, { useState, useEffect, useCallback } from 'react';
import AdminNavbarLinks from 'components/navbar/NavbarLinksAdmin';

export default function AdminNavbar(props) {
	const [scrolled, setScrolled] = useState(false);

	const { secondary, message, brandText, searchQuery, handleSearch } = props;

	// Change navbar on scroll
	const changeNavbar = useCallback(() => {
		if (window.scrollY > 1) {
			setScrolled(true);
		} else {
			setScrolled(false);
		}
	}, []);

	useEffect(() => {
		window.addEventListener('scroll', changeNavbar);

		return () => {
			window.removeEventListener('scroll', changeNavbar);
		};
	}, [changeNavbar]);

	// Styles depending on the state
	const mainText = useColorModeValue('navy.700', 'white');
	const secondaryText = useColorModeValue('gray.700', 'white');
	const navbarBg = useColorModeValue('rgba(244, 247, 254, 0.2)', 'rgba(11,20,55,0.5)');

	return (
		<Box
			position="fixed"
			boxShadow="none"
			bg={navbarBg}
			borderColor="transparent"
			filter="none"
			backdropFilter="blur(20px)"
			backgroundPosition="center"
			backgroundSize="cover"
			borderRadius="16px"
			borderWidth="1.5px"
			borderStyle="solid"
			transition="all 0.25s linear"
			alignItems={{ xl: 'center' }}
			display={secondary ? 'block' : 'flex'}
			minH="75px"
			justifyContent={{ xl: 'center' }}
			lineHeight="25.6px"
			mx="auto"
			mt={secondary ? '0px' : '0px'}
			pb="8px"
			right={{ base: '12px', md: '30px', lg: '30px', xl: '30px' }}
			px={{ sm: '15px', md: '10px' }}
			ps={{ xl: '12px' }}
			pt="8px"
			top={{ base: '12px', md: '16px', lg: '20px', xl: '20px' }}
			w={{
				base: 'calc(100vw - 6%)',
				md: 'calc(100vw - 8%)',
				lg: 'calc(100vw - 6%)',
				xl: 'calc(100vw - 350px)',
				'2xl': 'calc(100vw - 365px)',
			}}
		>
			<Flex
				w="100%"
				flexDirection={{ sm: 'column', md: 'row' }}
				alignItems={{ xl: 'center' }}
				mb="0px"
			>
				<Box mb={{ sm: '8px', md: '0px' }}>
					<Breadcrumb>
						<BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
							<BreadcrumbLink href="#" color={secondaryText}>
								Pages
							</BreadcrumbLink>
						</BreadcrumbItem>

						<BreadcrumbItem color={secondaryText} fontSize="sm" mb="5px">
							<BreadcrumbLink href="#" color={secondaryText}>
								{brandText}
							</BreadcrumbLink>
						</BreadcrumbItem>
					</Breadcrumb>
					{/* Here we create navbar brand, based on route name */}
					<Link
						color={mainText}
						href="#"
						bg="inherit"
						borderRadius="inherit"
						fontWeight="bold"
						fontSize="34px"
						_hover={{ color: mainText }}
						_active={{
							bg: 'inherit',
							transform: 'none',
							borderColor: 'transparent',
						}}
						_focus={{ boxShadow: 'none' }}
					>
						{brandText}
					</Link>
				</Box>
				<Box ms="auto" w={{ sm: '100%', md: 'unset' }}>
					<AdminNavbarLinks
						onOpen={props.onOpen}
						logoText={props.logoText}
						secondary={props.secondary}
						fixed={props.fixed}
						scrolled={scrolled}
						searchQuery={searchQuery}
						handleSearch={handleSearch}
					/>
				</Box>
			</Flex>
			{secondary && <Text color="white">{message}</Text>}
		</Box>
	);
}

AdminNavbar.propTypes = {
	brandText: PropTypes.string,
	variant: PropTypes.string,
	secondary: PropTypes.bool,
	fixed: PropTypes.bool,
	onOpen: PropTypes.func,
	message: PropTypes.string,
	searchQuery: PropTypes.string,
	handleSearch: PropTypes.func,
	logoText: PropTypes.string,
};
