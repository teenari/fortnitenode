module.exports = {
    Public: {
        partyType: "Public",
        inviteRestriction: "AnyMember",
        onlyLeaderFriendsCanJoin: false,
        presencePermission: "Anyone",
        invitePermission: "Anyone",
        acceptingMembers: true,
    },
    FriendsOnlyFromLeader: {
        partyType: "FriendsOnly",
        inviteRestriction: "LeaderOnly",
        onlyLeaderFriendsCanJoin: true,
        presencePermission: "Leader",
        invitePermission: "Leader",
        acceptingMembers: false
    },
    FriendsOnly: {
        partyType: "FriendsOnly",
        inviteRestriction: "AnyMember",
        onlyLeaderFriendsCanJoin: false,
        presencePermission: "Anyone",
        invitePermission: "AnyMember",
        acceptingMembers: true
    },
    Private: {
        partyType: "Private",
        inviteRestriction: "LeaderOnly",
        onlyLeaderFriendsCanJoin: true,
        presencePermission: "None",
        invitePermission: "Leader",
        acceptingMembers: false
    },
    PrivateFriends: {
        partyType: "Private",
        inviteRestriction: "AnyMember",
        onlyLeaderFriendsCanJoin: false,
        presencePermission: "None",
        invitePermission: "AnyMember",
        acceptingMembers: false
    }
}