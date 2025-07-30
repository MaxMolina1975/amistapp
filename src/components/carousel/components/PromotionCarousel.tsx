import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import { PromotionCard } from './PromotionCard';
import { promotions } from '../data/promotions';
import { Promotion } from '../../../lib/types';
import '../styles/carousel.css';
import 'swiper/css';
import 'swiper/css/pagination';

interface PromotionCarouselProps {
    className?: string;
    promotions?: Promotion[];
}

export function PromotionCarousel({ 
    className = '',
    promotions: customPromotions
}: PromotionCarouselProps) {
    const displayPromotions = customPromotions || promotions;

    return (
        <div className={`carousel-container ${className}`}>
            <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={2}
                pagination={{ 
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active'
                }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                loop={true}
                className="rounded-xl"
            >
                {displayPromotions.map((promotion) => (
                    <SwiperSlide key={promotion.id}>
                        <PromotionCard promotion={promotion} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
