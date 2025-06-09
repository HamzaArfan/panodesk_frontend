'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import DashboardLayout from '../../../components/DashboardLayout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { 
  Plus,
  Search,
  Edit,
  Trash2,
  MessageSquare,
  Eye,
  ChevronLeft,
  ChevronRight,
  Building2,
  FolderOpen,
  Route,
  Reply,
  User
} from 'lucide-react';
import { commentsAPI, toursAPI } from '../../../lib/api';
import toast from 'react-hot-toast';

function CommentsContent() {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    limit: 10
  });
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [selectedTour, setSelectedTour] = useState('');
  const [formData, setFormData] = useState({
    content: '',
    tourId: '',
    parentId: ''
  });

  useEffect(() => {
    loadComments();
    loadTours();
  }, [pagination.page, search, selectedTour]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (selectedTour) {
        params.tourId = selectedTour;
      }

      const response = await commentsAPI.getAll(params);
      
      if (response.data.success) {
        setComments(response.data.data.comments);
        setPagination(prev => ({
          ...prev,
          ...response.data.data.pagination
        }));
      }
    } catch (error) {
      console.error('Error loading comments:', error);
      toast.error('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const loadTours = async () => {
    try {
      const response = await toursAPI.getAll({ limit: 100 });
      if (response.data.success) {
        setTours(response.data.data.tours);
      }
    } catch (error) {
      console.error('Error loading tours:', error);
    }
  };

  const handleTourFilter = (e) => {
    setSelectedTour(e.target.value);
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const openModal = (comment = null, parentComment = null) => {
    setEditingComment(comment);
    setFormData(comment ? {
      content: comment.content,
      tourId: comment.tourId,
      parentId: comment.parentId || ''
    } : {
      content: '',
      tourId: parentComment?.tourId || '',
      parentId: parentComment?.id || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingComment(null);
    setFormData({
      content: '',
      tourId: '',
      parentId: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      let response;
      if (editingComment) {
        response = await commentsAPI.update(editingComment.id, formData);
      } else {
        // Clean up the form data before sending
        const cleanedFormData = {
          content: formData.content,
          tourId: formData.tourId,
        };
        
        // Only include parentId if it's not empty
        if (formData.parentId && formData.parentId.trim() !== '') {
          cleanedFormData.parentId = formData.parentId;
        }
        
        response = await commentsAPI.create(cleanedFormData);
      }

      if (response.data.success) {
        toast.success(`Comment ${editingComment ? 'updated' : 'created'} successfully`);
        closeModal();
        loadComments();
      }
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error(error.response?.data?.message || 'Failed to save comment');
    }
  };

  const handleDelete = async (comment) => {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await commentsAPI.delete(comment.id);
      if (response.data.success) {
        toast.success('Comment deleted successfully');
        loadComments();
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  const canEditComment = (comment) => {
    return (
      user?.role === 'SUPER_ADMIN' || 
      user?.role === 'SYSTEM_USER' ||
      comment.userId === user?.id ||
      (user?.role === 'ORGANIZATION_MANAGER' && comment.tour?.project?.organization?.managerId === user?.id)
    );
  };

  const canCreateComment = () => {
    return (
      user?.role === 'SUPER_ADMIN' || 
      user?.role === 'SYSTEM_USER' ||
      user?.role === 'ORGANIZATION_MANAGER' ||
      user?.role === 'REVIEWER'
    );
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Comments</h1>
            <p className="text-gray-600">View and manage tour comments</p>
          </div>
          {canCreateComment() && (
            <button
              onClick={() => openModal()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Comment
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search comments..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={selectedTour}
                onChange={handleTourFilter}
              >
                <option value="">All Tours</option>
                {tours.map(tour => (
                  <option key={tour.id} value={tour.id}>
                    {tour.name} (v{tour.version}) - {tour.project?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-500 mt-2">Loading comments...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Comment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tour
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Replies
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comments.map((comment) => (
                      <tr key={comment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                                <MessageSquare className="w-5 h-5 text-orange-600" />
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {comment.content}
                              </div>
                              {comment.parent && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Reply to: {comment.parent.content.substring(0, 50)}...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">
                                {comment.user?.firstName} {comment.user?.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{comment.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Route className="w-4 h-4 text-gray-400 mr-2" />
                            <div>
                              <div className="text-sm text-gray-900">{comment.tour?.name}</div>
                              <div className="text-sm text-gray-500 flex items-center">
                                <FolderOpen className="w-3 h-3 mr-1" />
                                {comment.tour?.project?.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {comment.parentId ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Reply
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Comment
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <Reply className="w-4 h-4 mr-1" />
                            {comment.replies?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            {canCreateComment() && !comment.parentId && (
                              <button
                                onClick={() => openModal(null, comment)}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Reply"
                              >
                                <Reply className="w-4 h-4" />
                              </button>
                            )}
                            {canEditComment(comment) && (
                              <>
                                <button
                                  onClick={() => openModal(comment)}
                                  className="text-blue-600 hover:text-blue-900 p-1"
                                  title="Edit"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDelete(comment)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing{' '}
                        <span className="font-medium">{(pagination.page - 1) * pagination.limit + 1}</span>
                        {' '}to{' '}
                        <span className="font-medium">
                          {Math.min(pagination.page * pagination.limit, pagination.total)}
                        </span>
                        {' '}of{' '}
                        <span className="font-medium">{pagination.total}</span>
                        {' '}results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                          disabled={pagination.page === 1}
                          className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                          disabled={pagination.page === pagination.pages}
                          className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                        >
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingComment ? 'Edit Comment' : formData.parentId ? 'Reply to Comment' : 'Add Comment'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  />
                </div>
                {!editingComment && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tour *
                    </label>
                    <select
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={formData.tourId}
                      onChange={(e) => setFormData(prev => ({ ...prev, tourId: e.target.value }))}
                      disabled={!!formData.parentId}
                    >
                      <option value="">Select a tour</option>
                      {tours.map(tour => (
                        <option key={tour.id} value={tour.id}>
                          {tour.name} (v{tour.version}) - {tour.project?.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    {editingComment ? 'Update' : formData.parentId ? 'Reply' : 'Add Comment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function CommentsPage() {
  return (
    <ProtectedRoute>
      <CommentsContent />
    </ProtectedRoute>
  );
} 