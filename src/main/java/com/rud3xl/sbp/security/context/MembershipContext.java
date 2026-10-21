package com.rud3xl.sbp.security.context;

import com.rud3xl.sbp.domain.Membership;

public class MembershipContext {
    private static final ThreadLocal<Membership> MEMBERSHIP = new ThreadLocal<>();
    public static Membership getOrganization() {
        return MEMBERSHIP.get();
    }
    public static void setMembership(Membership organization) {
        MEMBERSHIP.set(organization);
    }
    public static void clearMembership() {
        MEMBERSHIP.remove();
    }
}
