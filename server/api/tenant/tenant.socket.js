/**
 * Module for registering broadcast updates to clients when
 * the Tenant model changes. Exports the
 * [register function]{@link tenant:socket~registerTenantSockets}
 * to register the model schema events on the socket instance.
 * @module {function} tenant:socket
 * @requires {@link tenant:model}
 */
'use strict';

/**
 * The Tenant model instance
 * @type {tenant:model~Tenant}
 */
var Tenant = require('./tenant.model').model;

// export the function to register all socket broadcasts
exports.register = registerTenantSockets;

/**
 * Register Tenant model change events on the passed socket
 * @param {socket.io} socket - The socket object to register the Tenant model events on
 */
function registerTenantSockets(socket) {
	Tenant.schema.post('save', function (doc) {
		onSave(socket, doc);
	});

	Tenant.schema.post('remove', function (doc) {
		onRemove(socket, doc);
	});
}

/**
 * Emit a Tenant save event on a socket object: 'tenant:save'
 * @param {socket.io} socket - The socket object to emit the Tenant save event on
 * @param {MogooseDocument} doc - The saved document that triggered the event
 * @param {function} cb - The callback function
 */
function onSave(socket, doc, cb) {
	socket.emit('tenant:save', doc);
}

/**
 * Emit a Tenant remove event on a socket object: 'tenant:remove'
 * @param {socket.io} socket - The socket object to emit the Tenant remove event on
 * @param {MogooseDocument} doc - The removed document that triggered the event
 * @param {function} cb - The callback function
 */
function onRemove(socket, doc, cb) {
	socket.emit('tenant:remove', doc);
}
