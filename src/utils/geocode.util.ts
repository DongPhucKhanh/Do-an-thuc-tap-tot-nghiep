import axios from 'axios';

/**
 * Hàm lấy tọa độ (vĩ độ, kinh độ) từ một chuỗi địa chỉ
 * Sử dụng Nominatim API của OpenStreetMap (Miễn phí)
 * @param address Chuỗi địa chỉ (VD: "95 Tăng Nhơn Phú, Q9")
 * @returns { lat: number, lng: number } hoặc null nếu không tìm thấy
 */
export const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    try {
        if (!address || address.trim() === '') return null;

        const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                q: address,
                format: 'json',
                limit: 1
            },
            headers: {
                // Nominatim yêu cầu User-Agent để không bị chặn
                'User-Agent': 'VolunteerManagementSystem/1.0'
            }
        });

        if (response.data && response.data.length > 0) {
            return {
                lat: parseFloat(response.data[0].lat),
                lng: parseFloat(response.data[0].lon) // Nominatim trả về 'lon' thay vì 'lng'
            };
        }

        return null;
    } catch (error) {
        console.error("Lỗi khi geocoding địa chỉ:", address, error);
        return null;
    }
};
