import { useEffect, useState } from 'react';

import ClientCard from '../components/ClientCard';
import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import { deleteClient, fetchClients, updateClientStatus, updateFullBackendAccess } from '../services/clientService';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState('');
  const [error, setError] = useState('');

  const loadClients = async () => {
    try {
      const data = await fetchClients();
      setClients(data);
    } catch (err) {
      console.error('Failed to fetch clients:', err);
      setError(err.response?.data?.message || 'Unable to load clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClients();
  }, []);

  const onToggleStatus = async (client) => {
    const nextActive = !client.isActive;
    const confirmed = window.confirm(
      `${nextActive ? 'Activate' : 'Disable'} client "${client.name}" (${client.clientId})?`
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(client.clientId);
    setError('');

    try {
      await updateClientStatus(client.clientId, nextActive);
      await loadClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update client status.');
    } finally {
      setProcessingId('');
    }
  };

  const onDelete = async (client) => {
    const confirmed = window.confirm(
      `Delete client "${client.name}" (${client.clientId})? This also removes requests, bookings, and payments.`
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(client.clientId);
    setError('');

    try {
      await deleteClient(client.clientId);
      await loadClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete this client.');
    } finally {
      setProcessingId('');
    }
  };

  const onToggleFullBackend = async (client) => {
    const nextValue = !client.fullBackendEnabled;
    const confirmed = window.confirm(
      `${nextValue ? 'Enable' : 'Disable'} full backend for "${client.name}" (${client.clientId})?`
    );

    if (!confirmed) {
      return;
    }

    setProcessingId(client.clientId);
    setError('');

    try {
      await updateFullBackendAccess(client.clientId, nextValue);
      await loadClients();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update full backend access.');
    } finally {
      setProcessingId('');
    }
  };

  const filteredClients = clients.filter((client) => {
    const text = `${client.name} ${client.clientId} ${client.businessType} ${client.status}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  return (
    <section className="space-y-6 fade-rise">
      <PageHeader
        eyebrow="Client Registry"
        title="Clients"
        description="Monitor every onboarded client, current request state, and deployment URL from one management view."
        action={
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clients..."
            className="input-field w-full min-w-[16rem]"
          />
        }
      />

      {loading ? <p className="text-slate-400">Loading clients...</p> : null}
      {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      {!loading && !filteredClients.length ? (
        <EmptyState
          title={clients.length ? 'No matching clients' : 'No clients found'}
          description={
            clients.length
              ? 'Try a broader search to find the client you need.'
              : 'Client records will appear here after onboarding and request submission.'
          }
        />
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredClients.map((client) => (
          <ClientCard
            key={client.clientId}
            client={client}
            onToggleStatus={onToggleStatus}
            onToggleFullBackend={onToggleFullBackend}
            onDelete={onDelete}
            processing={processingId === client.clientId}
          />
        ))}
      </div>
    </section>
  );
};

export default ClientsPage;
