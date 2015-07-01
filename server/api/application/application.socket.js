/**
 * Module for registering broadcast updates to clients when
 * the Application model changes. Exports the
 * [register function]{@link application:socket~registerApplicationSockets}
 * to register the model schema events on the socket instance.
 * @module {function} application:socket
 * @requires {@link application:model}
 */
'use strict';

/**
 * The Application model instance
 * @type {application:model~Application}
 */
var Application = require('./application.model').model;

// export the function to register all socket broadcasts
exports.register = registerApplicationSockets;

/**
 * Register Application model change events on the passed socket
 * @param {socket.io} socket - The socket object to register the Application model events on
 */
function registerApplicationSockets(socket) {
	Application.schema.post('save', function (doc) {
		onSave(socket, doc);
	});

	Application.schema.post('remove', function (doc) {
		onRemove(socket, doc);
	});
}

/**
 * Emit a Application save event on a socket object: 'application:save'
 * @param {socket.io} socket - The socket object to emit the Application save event on
 * @param {MogooseDocument} doc - The saved document that triggered the event
 * @param {function} cb - The callback function
 */
function onSave(socket, doc, cb) {
	socket.emit('application:save', doc);
}

/**
 * Emit a Application remove event on a socket object: 'application:remove'
 * @param {socket.io} socket - The socket object to emit the Application remove event on
 * @param {MogooseDocument} doc - The removed document that triggered the event
 * @param {function} cb - The callback function
 */
function onRemove(socket, doc, cb) {
	socket.emit('application:remove', doc);
}
