import React from 'react';
import { Avatar, Button, Skeleton } from '../common';
import { Badge } from '../common/Badge';
import type { FamilyOverview, PendingInvite, SentInvite } from '../../types/family.types';

interface FamilyConnectionsListProps {
  overview: FamilyOverview | null;
  pendingInvites: PendingInvite[];
  sentInvites: SentInvite[];
  isLoading: boolean;
  onRespond: (inviteId: string, action: 'accept' | 'reject') => Promise<void>;
  respondingToId: string | null;
}

export const FamilyConnectionsList: React.FC<FamilyConnectionsListProps> = ({
  overview,
  pendingInvites,
  sentInvites,
  isLoading,
  onRespond,
  respondingToId
}) => {
  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Skeleton variant="rectangular" width="100%" height={64} style={{ borderRadius: '12px' }} />
        <Skeleton variant="rectangular" width="100%" height={64} style={{ borderRadius: '12px' }} />
        <Skeleton variant="rectangular" width="100%" height={64} style={{ borderRadius: '12px' }} />
      </div>
    );
  }

  const renderEmptyState = (message: string) => (
    <div style={{ padding: '16px', textAlign: 'center', backgroundColor: 'var(--color-surface-container-lowest)', borderRadius: '12px', border: '1px dashed var(--color-outline-variant)' }}>
      <p style={{ margin: 0, color: 'var(--color-on-surface-variant)', fontSize: '14px' }}>{message}</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
      {/* Your Family */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 12px 0' }}>
          Your Family
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {!overview?.hasFamily ? (
            renderEmptyState("You haven't created a family group yet — invite someone to get started")
          ) : (
            <>
              {overview.headInfo && (
                <div key={overview.headInfo._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <Avatar size="md" imageUrl={overview.headInfo.profilePictureUrl} />
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {overview.headInfo.name} {overview.isHead ? '(You)' : ''}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {overview.headInfo.email}
                      </p>
                    </div>
                  </div>
                  <Badge status="on-track" label="Head" />
                </div>
              )}
              {overview.members.map(member => (
                <div key={member._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <Avatar size="md" imageUrl={member.profilePictureUrl} />
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {member.name}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {member.email}
                      </p>
                    </div>
                  </div>
                  <Badge status="info" label="Member" />
                </div>
              ))}
            </>
          )}
        </div>
      </section>

      {/* Pending Invites for You */}
      <section>
        <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 12px 0' }}>
          Pending Invites for You
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {pendingInvites.length === 0 ? (
            renderEmptyState('No pending invites')
          ) : (
            pendingInvites.map(invite => (
              <div key={invite._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                  <Avatar size="md" imageUrl={invite.invitedByUserId.profilePictureUrl} />
                  <div style={{ overflow: 'hidden' }}>
                    <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {invite.invitedByUserId.name}
                    </p>
                    <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {invite.invitedByUserId.email}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Button 
                    variant="primary" 
                    onClick={() => onRespond(invite._id, 'accept')}
                    disabled={respondingToId === invite._id}
                    style={{ padding: '8px 16px', minWidth: 'auto', height: 'auto', fontSize: '14px' }}
                  >
                    {respondingToId === invite._id ? '...' : 'Accept'}
                  </Button>
                  <Button 
                    variant="text" 
                    onClick={() => onRespond(invite._id, 'reject')}
                    disabled={respondingToId === invite._id}
                    style={{ padding: '8px 16px', minWidth: 'auto', height: 'auto', fontSize: '14px', color: 'var(--color-error)' }}
                  >
                    Reject
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Invites You've Sent */}
      {overview?.isHead && (
        <section>
          <h3 style={{ fontFamily: 'var(--font-family-display)', fontSize: '16px', fontWeight: 600, color: 'var(--color-on-surface)', margin: '0 0 12px 0' }}>
            Invites You've Sent
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {sentInvites.length === 0 ? (
              renderEmptyState('No sent invites')
            ) : (
              sentInvites.map(invite => (
                <div key={invite._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-outline-variant)', borderRadius: '12px', gap: '16px', opacity: invite.status !== 'pending' ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ margin: 0, fontWeight: 500, color: 'var(--color-on-surface)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {invite.invitedEmail}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-on-surface-variant)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        Sent on {new Date(invite.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {invite.status === 'pending' && <Badge status="warning" label="Pending" />}
                  {invite.status === 'accepted' && <Badge status="on-track" label="Accepted" />}
                  {invite.status === 'rejected' && <Badge status="error" label="Rejected" />}
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
};
