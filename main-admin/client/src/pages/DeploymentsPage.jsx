import { useEffect, useState } from 'react';

import EmptyState from '../components/EmptyState';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { fetchDeployments } from '../services/deployService';

const DeploymentsPage = () => {
  const [deployments, setDeployments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDeployments = async () => {
      try {
        const data = await fetchDeployments();
        setDeployments(data);
      } catch (err) {
        console.error('Failed to fetch deployments:', err);
        setError(err.response?.data?.message || 'Unable to load deployment history.');
      } finally {
        setLoading(false);
      }
    };

    loadDeployments();
  }, []);

  return (
    <section className="space-y-6 fade-rise">
      <PageHeader
        eyebrow="Launch Audit"
        title="Deployments"
        description="Every simulated deployment is listed here with client metadata and assigned system type."
      />

      {loading ? <p className="text-slate-400">Loading deployments...</p> : null}
      {error ? <p className="rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p> : null}
      {!loading && !deployments.length ? (
        <EmptyState
          title="No deployments found"
          description="Approved launches will appear here once an admin deploys a client system."
        />
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/60">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-900/90 text-slate-300">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Business</th>
              <th className="px-4 py-3 text-left font-medium">System</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Deployed</th>
            </tr>
          </thead>
          <tbody>
            {deployments.map((item, index) => (
              <tr key={`${item.clientId}-${index}`} className="border-t border-slate-800 text-slate-200">
                <td className="px-4 py-3">{item.clientName}</td>
                <td className="px-4 py-3"><StatusBadge value={item.businessType} /></td>
                <td className="px-4 py-3"><StatusBadge value={item.systemType} /></td>
                <td className="px-4 py-3"><StatusBadge value={item.status} /></td>
                <td className="px-4 py-3 text-slate-400">{new Date(item.deployedAt || item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default DeploymentsPage;
