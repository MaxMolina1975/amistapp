import { Link } from 'react-router-dom';
import { Promotion } from '../../../lib/types';

interface PromotionCardProps {
    promotion: Promotion;
}

export function PromotionCard({ promotion }: PromotionCardProps) {
    return (
        <Link to={promotion.link} className="block">
            <div className="carousel-slide relative group">
                <div className="carousel-image-container">
                    <img 
                        src={promotion.imageUrl} 
                        alt={promotion.title}
                        className="carousel-image transition-transform duration-300 group-hover:scale-105"
                    />
                    {promotion.badge && (
                        <span className={`carousel-badge carousel-badge-${promotion.badge.toLowerCase()}`}>
                            {promotion.badge}
                        </span>
                    )}
                </div>
                <div className="carousel-content">
                    <h3 className="carousel-title">
                        {promotion.title}
                    </h3>
                    <p className="carousel-description">
                        {promotion.description}
                    </p>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-violet-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
        </Link>
    );
}
