/**
 * Centralized admin theme style utilities.
 * All admin page components import from here for consistent dark/light mode.
 */

// ─── Palette ─────────────────────────────────────────────────────────────────
export const palette = {
    light: {
        bg: '#f5f5f5',
        surface: '#ffffff',
        surfaceAlt: '#fafafa',
        sidebarBg: '#f8fafc', // Tối lại 1 tí (Slate 50) thay vì trắng tinh
        border: '#e5e7eb',
        borderLight: '#f3f4f6',
        text: '#111827',
        textSub: '#374151',
        textMuted: '#6b7280',
        textFaint: '#9ca3af',
    },
    dark: {
        bg: '#0f172a',
        surface: '#1e293b',
        surfaceAlt: '#263244',
        sidebarBg: '#1e293b',
        border: '#334155',
        borderLight: '#2d3f55',
        text: '#f1f5f9',
        textSub: '#cbd5e1',
        textMuted: '#94a3b8',
        textFaint: '#64748b',
    },
};

// ─── Common style getters ─────────────────────────────────────────────────────

export const getPageWrap = (isDark: boolean): React.CSSProperties => ({
    // empty — layout is set in AdminLayout, pages just render content
});

export const getSectionCard = (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? palette.dark.surface : palette.light.surface,
    borderRadius: '6px',
    border: `1px solid ${isDark ? palette.dark.border : palette.light.border}`,
    overflow: 'hidden',
});

export const getSectionHeader = (isDark: boolean): React.CSSProperties => ({
    padding: '12px 16px',
    borderBottom: `1px solid ${isDark ? palette.dark.border : palette.light.border}`,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: isDark ? palette.dark.surfaceAlt : palette.light.surfaceAlt,
});

export const getFilterPanel = (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? palette.dark.surfaceAlt : palette.light.surfaceAlt,
    padding: '14px 16px',
    borderRadius: '6px',
    border: `1px solid ${isDark ? palette.dark.border : palette.light.border}`,
    marginBottom: '16px',
});

export const getH2Style = (isDark: boolean): React.CSSProperties => ({
    margin: '0 0 20px 0',
    fontSize: '20px',
    fontWeight: 600,
    color: isDark ? palette.dark.text : palette.light.text,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
});

export const getSubText = (isDark: boolean): React.CSSProperties => ({
    margin: 0,
    fontSize: '13px',
    color: isDark ? palette.dark.textMuted : palette.light.textMuted,
});

export const getLabelStyle = (isDark: boolean): React.CSSProperties => ({
    fontSize: '13px',
    fontWeight: 600,
    color: isDark ? palette.dark.textSub : '#374151',
    display: 'block',
    marginBottom: '4px',
});

export const getInputStyle = (isDark: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '8px 10px',
    borderRadius: '6px',
    border: `1px solid ${isDark ? palette.dark.border : '#d1d5db'}`,
    outline: 'none',
    backgroundColor: isDark ? palette.dark.surfaceAlt : '#ffffff',
    color: isDark ? palette.dark.text : '#374151',
    fontSize: '13px',
    boxSizing: 'border-box',
});

export const getThStyle = (isDark: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    fontSize: '11px',
    fontWeight: 600,
    color: isDark ? palette.dark.textMuted : '#6b7280',
    backgroundColor: isDark ? palette.dark.surfaceAlt : '#f9fafb',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    textAlign: 'left',
    borderBottom: `1px solid ${isDark ? palette.dark.border : '#e5e7eb'}`,
});

export const getTdStyle = (isDark: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    fontSize: '13px',
    color: isDark ? palette.dark.textSub : '#374151',
    borderBottom: `1px solid ${isDark ? palette.dark.borderLight : '#f3f4f6'}`,
});

export const getRowHoverStyle = (isDark: boolean): React.CSSProperties => ({
    borderBottom: `1px solid ${isDark ? palette.dark.borderLight : '#f3f4f6'}`,
});

export const getStatCard = (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? palette.dark.surface : '#ffffff',
    padding: '14px 16px',
    borderRadius: '6px',
    border: `1px solid ${isDark ? palette.dark.border : '#e5e7eb'}`,
});

export const getStatLabel = (isDark: boolean): React.CSSProperties => ({
    color: isDark ? palette.dark.textMuted : '#6b7280',
    fontSize: '11px',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
});

// ─── Button styles ────────────────────────────────────────────────────────────

export const getBtnPrimary = (_isDark: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
});

export const getBtnEdit = (isDark: boolean): React.CSSProperties => ({
    padding: '5px 12px',
    backgroundColor: isDark ? '#1e3a5f' : '#eff6ff',
    color: isDark ? '#93c5fd' : '#2563eb',
    border: `1px solid ${isDark ? '#2563eb' : '#bfdbfe'}`,
    borderRadius: '4px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '12px',
});

export const getBtnDelete = (isDark: boolean): React.CSSProperties => ({
    border: 'none',
    background: isDark ? '#3f1f1f' : '#fee2e2',
    color: '#dc2626',
    padding: '6px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
});

export const getBtnApprove = (isDark: boolean): React.CSSProperties => ({
    border: 'none',
    background: isDark ? '#052e16' : '#dcfce7',
    color: '#16a34a',
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
});

export const getBtnReject = (isDark: boolean): React.CSSProperties => ({
    border: 'none',
    background: isDark ? '#3f1f1f' : '#fee2e2',
    color: '#dc2626',
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
});

export const getBtnSave = (_isDark: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '13px',
});

export const getBtnCancel = (isDark: boolean): React.CSSProperties => ({
    padding: '8px 16px',
    border: `1px solid ${isDark ? palette.dark.border : '#d1d5db'}`,
    fontWeight: 600,
    color: isDark ? palette.dark.textMuted : '#6b7280',
    borderRadius: '6px',
    cursor: 'pointer',
    backgroundColor: isDark ? palette.dark.surface : 'white',
    fontSize: '13px',
});

// ─── Badge / tag helpers ──────────────────────────────────────────────────────

export const getStatusBadge = (isDark: boolean, status: 'success' | 'warning' | 'danger' | 'neutral'): React.CSSProperties => {
    const map = {
        success: { bg: isDark ? '#052e16' : '#dcfce7', color: '#16a34a', border: isDark ? '#15803d' : '#86efac' },
        warning: { bg: isDark ? '#451a03' : '#fef3c7', color: '#d97706', border: isDark ? '#92400e' : '#fcd34d' },
        danger:  { bg: isDark ? '#3f1f1f' : '#fee2e2', color: '#dc2626', border: isDark ? '#dc2626' : '#fca5a5' },
        neutral: { bg: isDark ? '#1e293b' : '#f3f4f6', color: isDark ? '#94a3b8' : '#374151', border: isDark ? '#334155' : '#d1d5db' },
    };
    const { bg, color, border } = map[status];
    return {
        padding: '3px 10px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        backgroundColor: bg,
        color,
        border: `1px solid ${border}`,
    };
};

export const getTagStyle = (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? palette.dark.surfaceAlt : '#f3f4f6',
    color: isDark ? palette.dark.textSub : '#374151',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: 500,
});

export const getSmallText = (isDark: boolean): React.CSSProperties => ({
    fontSize: '12px',
    color: isDark ? palette.dark.textMuted : '#6b7280',
});

// ─── Modal styles ─────────────────────────────────────────────────────────────

export const getModalOverlay = (): React.CSSProperties => ({
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '16px',
    zIndex: 50,
});

export const getModalBox = (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? palette.dark.surface : 'white',
    borderRadius: '8px',
    border: `1px solid ${isDark ? palette.dark.border : '#e5e7eb'}`,
    overflow: 'hidden',
    maxWidth: '520px',
    width: '100%',
});

export const getModalHeader = (isDark: boolean): React.CSSProperties => ({
    backgroundColor: isDark ? '#0f172a' : '#1f2937',
    padding: '14px 16px',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
});

export const getModalBody = (isDark: boolean): React.CSSProperties => ({
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '75vh',
    overflowY: 'auto',
    backgroundColor: isDark ? palette.dark.surface : 'white',
});
