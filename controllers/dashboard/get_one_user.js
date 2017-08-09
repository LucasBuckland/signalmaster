'use strict';

const Duration = require('humanize-duration');
const Boom = require('boom');

module.exports = {
  description: 'Dashboard',
  tags: ['web', 'metrics'],
  handler: async function (request, reply) {

    const { id } = request.params;
    let user = {};

    try {
      user = await this.db.users.findOne({ id });
    }
    catch (err) {
      request.log(['error', 'getOneUser'], err);
    }

    if (!user) {
      throw Boom.notFound();
    }

    user.duration = Duration((user.ended_at || new Date(Date.now())).getTime() - user.created_at.getTime());

    const events = await this.db.events.find({ actor_id: id });

    return reply.view('single_user', { user, resource: id, data: events });
  }
};
