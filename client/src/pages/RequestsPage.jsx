import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import RequestCard from '../components/RequestCard';
import { fetchRequests } from '../services/requestService';

const RequestsPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchRequests();
        setRequests(data);
      } catch (err) {
        console.error('Failed to fetch requests:', err);
        setError(err.response?.data?.message || 'Unable to fetch request queue.');
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, []);

  const filteredRequests = requests.filter((request) => {
    const text = `${request.clientName} ${request.clientId} ${request.businessType} ${request.status}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <section className="space-y-6 fade-rise">
      <PageHeader
        eyebrow="Review Queue"
        title="Incoming Client Requests"
        description="Open each submission to inspect the builder JSON, approve the request, and deploy a generated client site."
        action={
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by client, ID, type..."
            className="input-field w-full min-w-[16rem]"
          />
        }
      />

      {loading ? <p className="text-slate-400">Loading requests...</p> : null}
      {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      {!loading && !filteredRequests.length ? (
        <EmptyState
          title={requests.length ? 'No matching requests' : 'No requests found'}
          description={
            requests.length
              ? 'Try a different search term to surface the client you are looking for.'
              : 'When clients submit new UI configurations, they will appear here.'
          }
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredRequests.map((request) => (
          <RequestCard
            key={`${request.clientId}-${request.createdAt}`}
            request={request}
            onOpen={() => navigate(`/admin/requests/${request.clientId}`)}
          />
        ))}
      </div>
    </section>
  );
};

export default RequestsPage;
