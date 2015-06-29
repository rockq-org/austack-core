/**
 * Module for registering broadcast updates to clients when
 * the App model changes. Exports the
 * [register function]{@link app:socket~registerAppSockets}
 * to register the model schema events on the socket instance.
 * @module {function} app:socket
 * @requires {@link app:model}
 */
'use strict';

/**
 * The App model instance
 * @type {app:model~App}
 */
var App = require('./app.model').model;

// export the function to register all socket broadcasts
exports.register = registerAppSockets;

/**
 * Register App model change events on the passed socket
 * @param {socket.io} socket - The socket object to register the App model events on
 */
function registerAppSockets(socket) {
	App.schema.post('save', function (doc) {
		onSave(socket, doc);
	});

	App.schema.post('remove', function (doc) {
		onRemove(socket, doc);
	});
}

/**
 * Emit a App save event on a socket object: 'app:save'
 * @param {socket.io} socket - The socket object to emit the App save event on
 * @param {MogooseDocument} doc - The saved document that triggered the event
 * @param {function} cb - The callback function
 */
function onSave(socket, doc, cb) {
	socket.emit('app:save', doc);
}

/**
 * Emit a App remove event on a socket object: 'app:remove'
 * @param {socket.io} socket - The socket object to emit the App remove event on
 * @param {MogooseDocument} doc - The removed document that triggered the event
 * @param {function} cb - The callback function
 */
function onRemove(socket, doc, cb) {
	socket.emit('app:remove', doc);
}
