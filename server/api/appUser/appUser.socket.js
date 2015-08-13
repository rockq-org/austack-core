/**
 * Module for registering broadcast updates to clients when
 * the AppUser model changes. Exports the
 * [register function]{@link appUser:socket~registerAppUserSockets}
 * to register the model schema events on the socket instance.
 * @module {function} appUser:socket
 * @requires {@link appUser:model}
 */
'use strict';

/**
 * The AppUser model instance
 * @type {appUser:model~AppUser}
 */
var AppUser = require('./appUser.model').model;

// export the function to register all socket broadcasts
exports.register = registerAppUserSockets;

/**
 * Register AppUser model change events on the passed socket
 * @param {socket.io} socket - The socket object to register the AppUser model events on
 */
function registerAppUserSockets(socket) {
	AppUser.schema.post('save', function (doc) {
		onSave(socket, doc);
	});

	AppUser.schema.post('remove', function (doc) {
		onRemove(socket, doc);
	});
}

/**
 * Emit a AppUser save event on a socket object: 'appUser:save'
 * @param {socket.io} socket - The socket object to emit the AppUser save event on
 * @param {MogooseDocument} doc - The saved document that triggered the event
 * @param {function} cb - The callback function
 */
function onSave(socket, doc, cb) {
	socket.emit('appUser:save', doc);
}

/**
 * Emit a AppUser remove event on a socket object: 'appUser:remove'
 * @param {socket.io} socket - The socket object to emit the AppUser remove event on
 * @param {MogooseDocument} doc - The removed document that triggered the event
 * @param {function} cb - The callback function
 */
function onRemove(socket, doc, cb) {
	socket.emit('appUser:remove', doc);
}
