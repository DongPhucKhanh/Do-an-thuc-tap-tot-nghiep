import { useState, useEffect } from 'react';
import api from '../../config/axios';
import { GraduationCap, PlusCircle, Trash2, BookOpen } from 'lucide-react';
import Pagination from '../../components/admin/Pagination';

export default function ManageFaculties() {
    const [faculties, setFaculties] = useState<any[]>([]);
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchFaculties = async () => {
        try {
            const res = await api.get('/faculties');
            setFaculties(res.data.data || []);
        } catch (error) {
            console.error("Lỗi tải danh sách khoa:", error);
        }
    };

    useEffect(() => {
        fetchFaculties();
    }, []);

    const handleAddFaculty = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return alert("Vui lòng nhập tên khoa!");

        setLoading(true);
        try {
            await api.post('/faculties', { name: name.trim() });
            alert("✅ Thêm Khoa thành công!");
            setName('');
            fetchFaculties();
        } catch (error: any) {
            alert(error.response?.data?.error || "Lỗi khi thêm Khoa (có thể tên đã tồn tại)!");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa khoa này không?\nTất cả dữ liệu liên quan có thể bị ảnh hưởng.")) return;

        try {
            await api.delete(`/faculties/${id}`);
            alert("Đã xóa khoa thành công!");
            fetchFaculties();
        } catch (error: any) {
            alert(error.response?.data?.error || "Không thể xóa khoa này!");
        }
    };

    const totalPages = Math.ceil(faculties.length / itemsPerPage);
    const paginatedFaculties = faculties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-10">
                <div className="bg-purple-100 p-4 rounded-2xl">
                    <GraduationCap size={36} className="text-purple-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Quản lý Khoa</h1>
                    <p className="text-gray-600 mt-1">Thêm và quản lý các khoa trong hệ thống</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Form thêm Khoa mới */}
                <div className="lg:col-span-4">
                    <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-6">
                        <div className="flex items-center gap-3 mb-6">
                            <PlusCircle size={24} className="text-purple-600" />
                            <h3 className="text-xl font-semibold text-gray-800">Thêm Khoa Mới</h3>
                        </div>

                        <form onSubmit={handleAddFaculty} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tên Khoa <span className="text-red-500">*</span>
                                </label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    required 
                                    placeholder="Ví dụ: Khoa Công nghệ Thông tin"
                                    className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                                />
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading || !name.trim()}
                                className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all shadow-md
                                    ${loading || !name.trim() 
                                        ? 'bg-gray-400 cursor-not-allowed' 
                                        : 'bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white'
                                    }`}
                            >
                                {loading ? 'Đang thêm...' : '➕ Thêm Khoa'}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Danh sách Khoa */}
                <div className="lg:col-span-8">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                            <div className="flex items-center gap-3">
                                <BookOpen size={24} className="text-purple-600" />
                                <h3 className="text-xl font-semibold text-gray-800">Danh sách Khoa hiện có</h3>
                            </div>
                            <div className="text-sm text-gray-500 font-medium">
                                Tổng cộng: <span className="font-semibold text-gray-700">{faculties.length}</span> khoa
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-8 py-5 text-left text-sm font-semibold text-gray-600">Tên Khoa</th>
                                        <th className="px-8 py-5 text-center text-sm font-semibold text-gray-600 w-32">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {paginatedFaculties.map((faculty, index) => (
                                        <tr key={faculty.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-8 py-6">
                                                <div className="font-medium text-gray-800 text-lg">
                                                    {faculty.name}
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <button 
                                                    onClick={() => handleDelete(faculty.id)}
                                                    className="inline-flex items-center justify-center w-10 h-10 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                                                    title="Xóa khoa"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {faculties.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-8 py-20 text-center">
                                                <div className="text-6xl mb-4">🏫</div>
                                                <p className="text-gray-500 text-lg">Chưa có khoa nào được thêm.</p>
                                                <p className="text-gray-400 mt-1">Hãy thêm khoa mới ở bên trái.</p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        {faculties.length > 0 && (
                            <Pagination 
                                currentPage={currentPage}
                                totalPages={totalPages}
                                totalItems={faculties.length}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setCurrentPage}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}