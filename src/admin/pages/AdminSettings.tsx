import React, { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Activity, Save, Check } from 'lucide-react';
import { adminApi } from '../services/adminApi';
import { useAdmin } from '../context/AdminContext';
import { AuditLogItem } from '../types/admin';

export const AdminSettings: React.FC = () => {
  const { showToast } = useAdmin();

  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>([]);
  const [notifyOnInquiry, setNotifyOnInquiry] = useState(true);
  const [notifyOnMessage, setNotifyOnMessage] = useState(true);
  const [autoArchive, setAutoArchive] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminApi.getAuditLogs().then((res) => {
      if (res && res.success) {
        setAuditLogs(res.auditLogs);
      }
    });
  }, []);

  const handleSavePreferences = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Notification and system settings updated!', 'success');
    }, 400);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-medium mb-1 block">
            Preferences &amp; System Telemetry
          </span>
          <h1 className="font-display font-medium text-2xl sm:text-3xl text-white tracking-tight">
            Settings &amp; Audit Logs
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-normal mt-0.5">
            Configure automated alerts, notification thresholds, and inspect historical audit changes.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#050807] font-medium text-xs tracking-wide transition-all shadow-[0_0_16px_rgba(16,185,129,0.3)] cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Save size={14} />
          <span>{saving ? 'Saving...' : 'Save Preferences'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Preferences */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col gap-5">
            <h2 className="font-display font-medium text-base text-white flex items-center gap-2">
              <Bell size={16} className="text-emerald-400" />
              <span>Real-Time Alert Notifications</span>
            </h2>

            <div className="flex flex-col gap-4">
              <label className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[#050b08] border border-white/[0.04] cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">
                    Immediate Inquiries Toast Alerts
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal leading-relaxed">
                    Trigger an immediate sound and pop-up notification when a client submits a new project request.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnInquiry}
                  onChange={(e) => setNotifyOnInquiry(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 mt-1 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[#050b08] border border-white/[0.04] cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">
                    Direct Contact Notes Sound / Banner
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal leading-relaxed">
                    Broadcast real-time banner when someone fills out the quick contact form.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnMessage}
                  onChange={(e) => setNotifyOnMessage(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 mt-1 cursor-pointer"
                />
              </label>

              <label className="flex items-start justify-between gap-4 p-3 rounded-xl bg-[#050b08] border border-white/[0.04] cursor-pointer">
                <div>
                  <span className="text-xs font-medium text-white block">
                    Auto-Archive Inquiries After 90 Days
                  </span>
                  <span className="text-[11px] text-gray-400 font-normal leading-relaxed">
                    Automatically move completed client projects to archived status to keep the pipeline clean.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoArchive}
                  onChange={(e) => setAutoArchive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-500 mt-1 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right: Audit Log Inspection */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <div className="p-6 rounded-2xl bg-[#08130f] border border-emerald-500/15 flex flex-col">
            <h2 className="font-display font-medium text-base text-white mb-1 flex items-center gap-2">
              <Activity size={16} className="text-emerald-400" />
              <span>System Audit History</span>
            </h2>
            <p className="text-xs text-gray-400 font-normal mb-4">
              Immutable event log tracking who modified published copy or managed client data.
            </p>

            <div className="flex flex-col gap-2.5 max-h-96 overflow-y-auto pr-1">
              {auditLogs.length === 0 ? (
                <p className="text-xs text-gray-500 py-6 text-center font-mono">
                  No historical logs recorded.
                </p>
              ) : (
                auditLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#050b08] border border-white/[0.04] flex flex-col gap-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span className="text-emerald-400 font-medium">{log.actor}</span>
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="text-gray-300 font-normal leading-snug">
                      <span className="font-mono text-emerald-300 mr-1.5 font-medium">
                        [{log.action}]
                      </span>
                      {log.details}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
