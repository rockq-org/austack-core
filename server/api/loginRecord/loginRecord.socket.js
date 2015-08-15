/**
 * Module for registering broadcast updates to clients when
 * the LoginRecord model changes. Exports the
 * [register function]{@link loginRecord:socket~registerLoginRecordSockets}
 * to register the model schema events on the socket instance.
 * @module {function} loginRecord:socket
 * @requires {@link loginRecord:model}
 */
'use strict';

/**
 * The LoginRecord model instance
 * @type {loginRecord:model~LoginRecord}
 */
var LoginRecord = require('./loginRecord.model').model;

// export the function to register all socket broadcasts
exports.register = registerLoginRecordSockets;

/**
 * Register LoginRecord model change events on the passed socket
 * @param {socket.io} socket - The socket object to register the LoginRecord model events on
 */
function registerLoginRecordSockets(socket) {
	LoginRecord.schema.post('save', function (doc) {
		onSave(socket, doc);
	});

	LoginRecord.schema.post('remove', function (doc) {
		onRemove(socket, doc);
	});
}

/**
 * Emit a LoginRecord save event on a socket object: 'loginRecord:save'
 * @param {socket.io} socket - The socket object to emit the LoginRecord save event on
 * @param {MogooseDocument} doc - The saved document that triggered the event
 * @param {function} cb - The callback function
 */
function onSave(socket, doc, cb) {
	socket.emit('loginRecord:save', doc);
}

/**
 * Emit a LoginRecord remove event on a socket object: 'loginRecord:remove'
 * @param {socket.io} socket - The socket object to emit the LoginRecord remove event on
 * @param {MogooseDocument} doc - The removed document that triggered the event
 * @param {function} cb - The callback function
 */
function onRemove(socket, doc, cb) {
	socket.emit('loginRecord:remove', doc);
}
