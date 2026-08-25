import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'rooms' | 'vocab' | 'import'

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // User search filter
  const [userSearch, setUserSearch] = useState('');

  // New Chat Room form state
  const [newRoom, setNewRoom] = useState({
    name: '',
    tamil_name: '',
    description: '',
    room_type: 'public'
  });

  // Vocab creation form state
  const [newWord, setNewWord] = useState({
    word: '',
    phonetic: '',
    part_of_speech: 'noun',
    meaning: '',
    simple_meaning: '',
    tamil_meaning: '',
    level_id: 'A1',
    example: '',
    tamil_example: ''
  });

  // Bulk Import state
  const [importEntity, setImportEntity] = useState('vocabulary');
  const [jsonInput, setJsonInput] = useState('');
  const [importResult, setImportResult] = useState(null);
  const [importing, setImporting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statRes, userRes, roomRes] = await Promise.all([
        api.getAdminStats(),
        api.getAllUsers(),
        api.getChatRooms()
      ]);
      if (statRes.success) setStats(statRes.data);
      if (userRes.success) setUsersList(userRes.data);
      if (roomRes.success) setChatRooms(roomRes.data.publicRooms || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserStatus(userId, { role: newRole });
      setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } catch (err) {
      alert(err.message || 'Failed to update user role');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await api.updateUserStatus(userId, { status: newStatus });
      setUsersList((prev) => prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u)));
    } catch (err) {
      alert(err.message || 'Failed to update user status');
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!newRoom.name.trim()) return;

    try {
      const res = await api.createChatRoom(newRoom);
      if (res.success) {
        alert('Public Chat Room created successfully!');
        setNewRoom({ name: '', tamil_name: '', description: '', room_type: 'public' });
        loadData();
      }
    } catch (err) {
      alert(err.message || 'Failed to create room');
    }
  };

  const handleCreateVocab = async (e) => {
    e.preventDefault();
    if (!newWord.word || !newWord.meaning || !newWord.tamil_meaning) return;

    try {
      await api.createVocabulary(newWord);
      alert('Word added successfully!');
      setNewWord({
        word: '',
        phonetic: '',
        part_of_speech: 'noun',
        meaning: '',
        simple_meaning: '',
        tamil_meaning: '',
        level_id: 'A1',
        example: '',
        tamil_example: ''
      });
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to create word');
    }
  };

  const handleRunImport = async () => {
    if (!jsonInput.trim()) return;
    setImporting(true);
    setImportResult(null);

    try {
      const parsed = JSON.parse(jsonInput.trim());
      const res = await api.importContent({
        entityType: importEntity,
        data: Array.isArray(parsed) ? parsed : [parsed]
      });

      if (res.success && res.data) {
        setImportResult(res.data);
        loadData();
      }
    } catch (err) {
      alert('Invalid JSON input: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  const filteredUsers = usersList.filter(u =>
    (u.full_name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.username || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.phone_number || '').includes(userSearch)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 pt-4 pb-nav flex flex-col gap-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-surface font-display flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">admin_panel_settings</span>
            Admin Control Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5 font-medium">
            Manage users, system roles, public chat rooms, Samacheer Kalvi syllabus, and vocabulary datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-primary-fixed text-primary border border-primary/20">
            Role: {user?.role || 'Admin'}
          </span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 p-1 rounded-2xl bg-surface-container border border-surface-variant/50 hide-scrollbar">
        {[
          { id: 'overview', label: 'Overview & Stats', icon: 'monitoring' },
          { id: 'users', label: `User Management (${usersList.length})`, icon: 'group' },
          { id: 'rooms', label: `Chat Rooms (${chatRooms.length})`, icon: 'forum' },
          { id: 'vocab', label: 'Add Vocabulary', icon: 'style' },
          { id: 'import', label: 'Bulk JSON Importer', icon: 'file_upload' }
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 ${
              activeTab === t.id
                ? 'bg-surface-container-lowest text-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined animate-spin text-primary text-[40px]">progress_activity</span>
        </div>
      ) : (
        <>
          {/* TAB 1: OVERVIEW & SYSTEM STATS */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { label: 'Total Users', value: stats?.users || usersList.length, icon: 'group', color: 'text-primary' },
                  { label: 'Courses', value: stats?.courses || 13, icon: 'school', color: 'text-secondary' },
                  { label: 'Modules', value: stats?.modules || 64, icon: 'folder', color: 'text-tertiary' },
                  { label: 'Lessons', value: stats?.lessons || 167, icon: 'menu_book', color: 'text-primary' },
                  { label: 'Vocabulary', value: stats?.vocabulary || 1050, icon: 'style', color: 'text-secondary' },
                  { label: 'Exercises', value: stats?.exercises || 30, icon: 'sports_esports', color: 'text-tertiary' }
                ].map((s) => (
                  <div key={s.label} className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-1">
                    <span className="material-symbols-outlined text-[24px] text-on-surface-variant">{s.icon}</span>
                    <span className="text-[10px] font-bold text-on-surface-variant uppercase">{s.label}</span>
                    <p className={`text-2xl font-extrabold font-display ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-high border border-surface-variant/60 flex flex-col gap-3">
                <h3 className="font-bold text-base text-on-surface font-display">System Quick Actions</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab('users')}
                    className="px-4 py-2.5 rounded-2xl bg-primary text-white font-bold text-xs shadow-md"
                  >
                    Manage Registered Users
                  </button>
                  <button
                    onClick={() => setActiveTab('rooms')}
                    className="px-4 py-2.5 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md"
                  >
                    Create New Practice Chat Room
                  </button>
                  <button
                    onClick={() => setActiveTab('import')}
                    className="px-4 py-2.5 rounded-2xl bg-surface-container border border-surface-variant text-on-surface font-bold text-xs"
                  >
                    Batch Import Samacheer Data
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <input
                  type="text"
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  placeholder="Search users by name, email, username, phone..."
                  className="w-full sm:w-80 px-4 py-2.5 rounded-2xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                />
                <span className="text-xs text-on-surface-variant font-bold">
                  Showing {filteredUsers.length} of {usersList.length} users
                </span>
              </div>

              <p className="sm:hidden text-[11px] text-on-surface-variant font-medium px-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">swipe_left</span>
                Swipe the table sideways to see every column.
              </p>

              <div className="bg-surface-container-lowest rounded-3xl border border-surface-variant/70 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  {/* min-w forces a horizontal scroll instead of crushing six
                      columns into a 320px phone. */}
                  <table className="w-full min-w-[880px] text-left text-xs text-on-surface">
                    <thead className="bg-surface-container text-on-surface-variant font-bold uppercase text-[10px]">
                      <tr>
                        <th className="p-3.5">User</th>
                        <th className="p-3.5">Contact / Handles</th>
                        <th className="p-3.5">Level & XP</th>
                        <th className="p-3.5">Role</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-variant/40">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-surface-container/50 transition-colors">
                          <td className="p-3.5">
                            <div className="font-bold">{u.full_name || 'Learner'}</div>
                            <div className="text-[10px] text-on-surface-variant">ID: #{u.id}</div>
                          </td>
                          <td className="p-3.5">
                            <div>{u.email}</div>
                            {u.username && <div className="text-[10px] text-primary font-bold">@{u.username}</div>}
                            {u.phone_number && <div className="text-[10px] text-on-surface-variant">📞 {u.phone_number}</div>}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary font-bold text-[10px]">
                              {u.current_level || 'A1'}
                            </span>
                            <div className="text-[10px] font-bold text-tertiary mt-0.5">⭐ {u.xp || 0} XP</div>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2.5 py-1 rounded-xl font-bold text-[10px] uppercase ${
                              u.role === 'admin' ? 'bg-error-container text-error' : u.role === 'teacher' ? 'bg-secondary-container text-secondary' : 'bg-surface-variant text-on-surface-variant'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                              u.status === 'active' ? 'bg-secondary-container/40 text-secondary' : 'bg-error-container/40 text-error'
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="p-3.5 text-right flex items-center justify-end gap-1.5">
                            <select
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="px-2 py-1 rounded-xl bg-surface-container border border-surface-variant text-[11px] font-bold"
                            >
                              <option value="user">User</option>
                              <option value="teacher">Teacher</option>
                              <option value="admin">Admin</option>
                            </select>

                            <button
                              onClick={() => handleStatusChange(u.id, u.status === 'active' ? 'banned' : 'active')}
                              className={`px-2.5 py-1 rounded-xl font-bold text-[11px] ${
                                u.status === 'active' ? 'bg-error-container/40 text-error' : 'bg-secondary-container/40 text-secondary'
                              }`}
                            >
                              {u.status === 'active' ? 'Ban' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHAT ROOM MANAGEMENT */}
          {activeTab === 'rooms' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Form: Create Room */}
              <div className="p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-4">
                <h3 className="font-bold text-base text-on-surface font-display flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[20px]">add_comment</span>
                  Create Public Chat Room
                </h3>

                <form onSubmit={handleCreateRoom} className="flex flex-col gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Room Name (English)</label>
                    <input
                      type="text"
                      value={newRoom.name}
                      onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                      placeholder="e.g. Spoken English Club"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Tamil Title (தமிழ் பெயர்)</label>
                    <input
                      type="text"
                      value={newRoom.tamil_name}
                      onChange={(e) => setNewRoom({ ...newRoom, tamil_name: e.target.value })}
                      placeholder="e.g. ஆங்கில பேச்சு பயிற்சி அரங்கம்"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Description</label>
                    <textarea
                      value={newRoom.description}
                      onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                      placeholder="Describe what learners will practice in this room..."
                      className="w-full p-3 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary h-20"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-container transition-all mt-2"
                  >
                    + Create Chat Room
                  </button>
                </form>
              </div>

              {/* Active Public Rooms List */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <h3 className="font-bold text-base text-on-surface font-display">
                  Active Public Practice Rooms ({chatRooms.length})
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {chatRooms.map((r) => (
                    <div key={r.id} className="p-4 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-2">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-bold text-sm text-on-surface">{r.name}</h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-fixed/40 text-primary">
                          Public
                        </span>
                      </div>

                      {r.tamil_name && (
                        <p className="text-xs font-tamil text-primary font-medium">{r.tamil_name}</p>
                      )}

                      <p className="text-xs text-on-surface-variant line-clamp-2">{r.description}</p>

                      <div className="text-[10px] font-bold text-outline mt-1">
                        💬 {r.message_count || 0} messages sent
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADD VOCABULARY */}
          {activeTab === 'vocab' && (
            <div className="max-w-2xl mx-auto w-full p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-base text-on-surface font-display flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">style</span>
                Add New Vocabulary Word
              </h3>

              <form onSubmit={handleCreateVocab} className="flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Word</label>
                    <input
                      type="text"
                      value={newWord.word}
                      onChange={(e) => setNewWord({ ...newWord, word: e.target.value })}
                      placeholder="e.g. Resilience"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Phonetic Guide</label>
                    <input
                      type="text"
                      value={newWord.phonetic}
                      onChange={(e) => setNewWord({ ...newWord, phonetic: e.target.value })}
                      placeholder="e.g. /rɪˈzɪl.jəns/"
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Level</label>
                    <select
                      value={newWord.level_id}
                      onChange={(e) => setNewWord({ ...newWord, level_id: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-surface-variant text-xs font-bold"
                    >
                      <option value="A1">A1 - Beginner</option>
                      <option value="A2">A2 - Elementary</option>
                      <option value="B1">B1 - Intermediate</option>
                      <option value="B2">B2 - Upper Int.</option>
                      <option value="C1">C1 - Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">English Meaning</label>
                  <input
                    type="text"
                    value={newWord.meaning}
                    onChange={(e) => setNewWord({ ...newWord, meaning: e.target.value })}
                    placeholder="Clear definition in English..."
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Tamil Meaning (தமிழ் அர்த்தம்)</label>
                  <input
                    type="text"
                    value={newWord.tamil_meaning}
                    onChange={(e) => setNewWord({ ...newWord, tamil_meaning: e.target.value })}
                    placeholder="e.g. மன உறுதி, மீண்டு வரும் திறன்"
                    className="w-full px-3.5 py-2 rounded-xl bg-surface-container border border-surface-variant text-xs font-medium text-on-surface focus:outline-none focus:border-primary"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-primary text-white font-bold text-xs shadow-md hover:bg-primary-container transition-all mt-2"
                >
                  + Add Word to Database
                </button>
              </form>
            </div>
          )}

          {/* TAB 5: BULK IMPORTER */}
          {activeTab === 'import' && (
            <div className="max-w-3xl mx-auto w-full p-4 sm:p-6 rounded-3xl bg-surface-container-lowest border border-surface-variant/70 shadow-sm flex flex-col gap-4">
              <h3 className="font-bold text-base text-on-surface font-display flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">file_upload</span>
                Bulk JSON Dataset Importer
              </h3>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-on-surface-variant">Entity Type:</span>
                <select
                  value={importEntity}
                  onChange={(e) => setImportEntity(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-surface-container border border-surface-variant text-xs font-bold"
                >
                  <option value="vocabulary">Vocabulary Words</option>
                  <option value="lessons">Lessons</option>
                  <option value="exercises">Exercises & MCQs</option>
                  <option value="grammar">Grammar Topics</option>
                </select>
              </div>

              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder="Paste JSON array here..."
                className="w-full h-48 p-4 rounded-2xl bg-surface-container border border-surface-variant text-xs font-mono text-on-surface focus:outline-none focus:border-primary"
              />

              <button
                onClick={handleRunImport}
                disabled={importing || !jsonInput.trim()}
                className="w-full py-3 rounded-2xl bg-secondary text-white font-bold text-xs shadow-md hover:bg-secondary/90 transition-all disabled:opacity-40"
              >
                {importing ? 'Importing...' : 'Run Batch Import'}
              </button>

              {importResult && (
                <div className="p-4 rounded-2xl bg-secondary-container/30 border border-secondary/30 text-xs text-secondary font-medium">
                  ✅ Import successful! Processed records.
                </div>
              )}
            </div>
          )}
        </>
      )}

    </div>
  );
}
