using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    [Authorize]
    public class PresenceHub : Hub
    {
        private readonly PresenceTracker _presenceTracker;
        public PresenceHub(PresenceTracker presenceTracker)
        {
            _presenceTracker = presenceTracker;
        }

        public override async Task OnConnectedAsync()
        {
            string username = Context.User.GetUsername();

            var isOnline = await _presenceTracker.UserConnected(username, Context.ConnectionId);
            if (isOnline)
                await Clients.Others.SendAsync("UserIsOnline", username);

            var currentUsers = await _presenceTracker.GetOnlineUsers();
            await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            string username = Context.User.GetUsername();

            var isOffline = await _presenceTracker.UserDisconnected(username, Context.ConnectionId);

            if (isOffline)
                await Clients.Others.SendAsync("UserIsOffline", username);

            await base.OnDisconnectedAsync(exception);
        }
    }
}