import React, { useEffect, useState } from 'react';
import API from '../../api';

const PostsSection = ({ club }) => {
    const [posts, setPosts] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [form, setForm] = useState({ title: '', content: '', tags: '', image: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (club?._id) loadPosts();
    }, [club]);

    const loadPosts = async () => {
        try {
            const res = await API.get(`/posts?clubId=${club._id}`);
            setPosts(res.data.data || []);
        } catch (err) { console.error(err); }
    };

    const openCreate = () => {
        setEditingPost(null);
        setForm({ title: '', content: '', tags: '', image: '' });
        setShowModal(true);
    };

    const openEdit = (post) => {
        setEditingPost(post);
        setForm({
            title: post.title, content: post.content,
            tags: (post.tags || []).join(', '), image: post.image || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const payload = {
            title: form.title, content: form.content,
            clubId: club._id, image: form.image || null,
            tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
            author: club.presidentName || 'President'
        };
        try {
            if (editingPost) {
                await API.put(`/posts/${editingPost._id}`, payload);
            } else {
                await API.post('/posts', payload);
            }
            setShowModal(false);
            loadPosts();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save post');
        } finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await API.delete(`/posts/${id}`);
            loadPosts();
        } catch (err) { alert('Failed to delete post'); }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-black text-slate-900">Posts</h2>
                    <p className="text-sm text-slate-400 mt-1">{posts.length} posts</p>
                </div>
                <button onClick={openCreate} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all flex items-center gap-2">
                    <span className="text-lg">+</span> Create Post
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6" onClick={e => e.stopPropagation()}>
                        <h3 className="text-xl font-black text-slate-900 mb-5">{editingPost ? 'Edit Post' : 'Create Post'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post Title" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" required />
                            <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your post content..." className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500 h-32 resize-none" required />
                            <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="Tags (comma separated)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" />
                            <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="Image URL (optional)" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-blue-500" />
                            <div className="flex gap-3 pt-2">
                                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-3 rounded-xl text-sm font-bold hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : editingPost ? 'Update' : 'Publish'}</button>
                                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Posts Grid */}
            {posts.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                    <span className="text-4xl mb-4 block">✏️</span>
                    <h3 className="text-lg font-bold text-slate-900">No posts yet</h3>
                    <p className="text-sm text-slate-400 mt-1">Share updates with your club members</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Post</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Likes</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {posts.map(post => (
                                <tr key={post._id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-800">{post.title}</p>
                                        <div className="flex gap-1 mt-1">
                                            {(post.tags || []).slice(0, 3).map((tag, i) => (
                                                <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">{tag}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-sm text-slate-600 font-semibold">❤️ {post.likes}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${post.isPublished ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => openEdit(post)} className="text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all">Edit</button>
                                            <button onClick={() => handleDelete(post._id)} className="text-red-500 bg-red-50 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-100 transition-all">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PostsSection;
