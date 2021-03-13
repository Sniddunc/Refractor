export const SUPER_ADMIN = 'SUPER_ADMIN';
export const FULL_ACCESS = 'FULL_ACCESS';
export const LOG_WARNING = 'LOG_WARNING';
export const LOG_MUTE = 'LOG_MUTE';
export const LOG_KICK = 'LOG_KICK';
export const LOG_BAN = 'LOG_BAN';
export const EDIT_OWN_INFRACTIONS = 'EDIT_OWN_INFRACTIONS';
export const EDIT_ANY_INFRACTION = 'EDIT_ANY_INFRACTION';
export const DELETE_OWN_INFRACTIONS = 'DELETE_OWN_INFRACTIONS';
export const DELETE_ANY_INFRACTION = 'DELETE_ANY_INFRACTION';

/* global BigInt */
/* prettier-ignore */
export const flags = {
	SUPER_ADMIN: 				BigInt(0b1000000000000000000000000000000000000000000000000000000000000000),
	FULL_ACCESS:				BigInt(0b0100000000000000000000000000000000000000000000000000000000000000),
	LOG_WARNING: 				BigInt(0b0010000000000000000000000000000000000000000000000000000000000000),
	LOG_MUTE: 					BigInt(0b0001000000000000000000000000000000000000000000000000000000000000),
	LOG_KICK: 					BigInt(0b0000100000000000000000000000000000000000000000000000000000000000),
	LOG_BAN: 					BigInt(0b0000010000000000000000000000000000000000000000000000000000000000),
	EDIT_OWN_INFRACTIONS: 		BigInt(0b0000001000000000000000000000000000000000000000000000000000000000),
	EDIT_ANY_INFRACTION: 		BigInt(0b0000000100000000000000000000000000000000000000000000000000000000),
	DELETE_OWN_INFRACTIONS: 	BigInt(0b0000000010000000000000000000000000000000000000000000000000000000),
	DELETE_ANY_INFRACTION: 		BigInt(0b0000000001000000000000000000000000000000000000000000000000000000),
};

// hasPermissions takes in a BigInt userPerms variable and a BigInt flag and runs bitwise comparison on them
// to check if the userPerms has the flag needed. YOU MUST USE THE BIGINT GLOBAL FOR THIS. We use 64 bit integers
// for permissions, but JavaScript only supports 52 bit integers by default. The BigInt global lets us use 63 bits.
export function hasPermission(userPerms, flag) {
	const res = userPerms & flag;

	return res === flag;
}

export function isRestricted(flagName) {
	if (flagName === SUPER_ADMIN) {
		return true;
	}

	return false;
}

export function getGrantedPerms(perms) {
	const granted = [];

	Object.keys(flags).forEach((flagName) => {
		if (hasPermission(BigInt(perms), BigInt(flags[flagName]))) {
			granted.push(flagName);
		}
	});

	return granted;
}
