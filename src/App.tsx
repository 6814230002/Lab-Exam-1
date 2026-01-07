import { useState } from 'react'
import './App.css'

interface PetGalleryItem {
    id: string;
    url: string;
    label: string;
}

type GalleryType = 'dog' | 'cat' | 'sea';

function App() {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [petType, setPetType] = useState<GalleryType>('dog');
    const [petImages, setPetImages] = useState<PetGalleryItem[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPets = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            let formattedData: PetGalleryItem[] = [];

            if (petType === 'dog') {
                // --- สำหรับสุนัข (ปรับเป็นแบบสุ่ม 6 รูป) ---
                const response = await fetch(`https://dog.ceo/api/breeds/image/random/6`);
                const data = await response.json();

                if (data.status === "success") {
                    formattedData = data.message.map((url: string, index: number) => ({
                        id: `dog-${index}-${Date.now()}`,
                        url: url,
                        label: `Happy Dog 🐶`
                    }));
                } else {
                    throw new Error("ไม่สามารถดึงข้อมูลสุนัขได้");
                }

            } else if (petType === 'cat') {
                // --- สำหรับแมว (สุ่ม) ---
                const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=6`);
                const data = await response.json();

                formattedData = data.map((item: any) => ({
                    id: item.id,
                    url: item.url,
                    label: "Cute Cat 🐱"
                }));

            } else if (petType === 'sea') {
                // --- สำหรับวิวทะเล (ใช้การค้นหาหรือสุ่ม) ---
                const query = searchTerm.toLowerCase().trim();
                const accessKey = "";
                const searchQuery = query || "sea";
                const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=6&client_id=${accessKey}`);
                const data = await response.json();

                if (data.results && data.results.length > 0) {
                    formattedData = data.results.map((item: any) => ({
                        id: item.id,
                        url: item.urls.regular,
                        label: item.alt_description || "Beautiful Sea 🌊"
                    }));
                } else {
                    throw new Error("ไม่พบรูปภาพวิวทะเล");
                }
            }

            setPetImages(formattedData);
        } catch (err: any) {
            setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
            setPetImages([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="gallery-container">
            <h1 className="title">MULTI-SEARCH GALLERY</h1>

            {/* ส่วนเลือกประเภท */}
            <div className="type-selector">
                <button
                    className={petType === 'dog' ? 'active' : ''}
                    onClick={() => { setPetType('dog'); setPetImages([]); setSearchTerm(''); }}
                >
                    🐶 DOG
                </button>
                <button
                    className={petType === 'cat' ? 'active' : ''}
                    onClick={() => { setPetType('cat'); setPetImages([]); setSearchTerm(''); }}
                >
                    🐱 CAT
                </button>
                <button
                    className={petType === 'sea' ? 'active' : ''}
                    onClick={() => { setPetType('sea'); setPetImages([]); setSearchTerm(''); }}
                >
                    🌊 SEA
                </button>
            </div>

            {/* ส่วนของช่องค้นหา / ข้อมูลโหมด */}
            <form onSubmit={fetchPets} className="search-box">
                {petType === 'dog' && (
                    <div className="mode-info">โหมดหมา: กดปุ่มเพื่อสุ่มรูปน้องหมาน่ารักๆ</div>
                )}

                {petType === 'cat' && (
                    <div className="mode-info">โหมดแมว: กดปุ่มเพื่อสุ่มรูปน้องแมว</div>
                )}

                <button type="submit" className="search-button">
                    {petType === 'dog' ? 'สุ่มรูปหมา' :
                        petType === 'cat' ? 'สุ่มรูปแมว' : 'ค้นหาวิวทะเล'}
                </button>
            </form>

            {loading && <div className="loader">กำลังโหลดรูปสวยๆ...</div>}
            {error && <div className="error-message">{error}</div>}

            {/* แสดงผลแกลเลอรี */}
            {!loading && (
                <div className="image-grid">
                    {petImages.map((item) => (
                        <div key={item.id} className="image-card">
                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                <img src={item.url} alt="gallery" className="gallery-image" />
                                <div className="image-info">
                                    <p>{item.label}</p>
                                </div>
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {petImages.length === 0 && !loading && !error && (
                <p className="placeholder-text">
                    {petType === 'dog' ? 'กดปุ่มเพื่อเริ่มสุ่มรูปหมา' :
                        petType === 'cat' ? 'กดปุ่มเพื่อเริ่มสุ่มรูปแมว' :
                            'พิมพ์สิ่งที่สนใจเกี่ยวกับทะเลแล้วกดค้นหา'}
                </p>
            )}
        </div>
    )
}

export default App