import { render, screen } from '@testing-library/react';
import { PromotionCard } from '../components/PromotionCard';
import { Promotion } from '../../../lib/types';

describe('PromotionCard', () => {
    const mockPromotion: Promotion = {
        id: 1,
        title: "Test Card",
        description: "Test Description",
        imageUrl: "test-image.jpg",
        category: 'feature',
        badge: 'New'
    };

    it('renders promotion content correctly', () => {
        render(<PromotionCard promotion={mockPromotion} />);
        
        expect(screen.getByText('Test Card')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByAltText('Test Card')).toHaveAttribute('src', 'test-image.jpg');
    });

    it('renders badge when provided', () => {
        render(<PromotionCard promotion={mockPromotion} />);
        expect(screen.getByText('New')).toBeInTheDocument();
    });

    it('applies correct classes', () => {
        const { container } = render(<PromotionCard promotion={mockPromotion} />);
        expect(container.firstChild).toHaveClass('carousel-slide');
        expect(screen.getByText('Test Card')).toHaveClass('carousel-title');
        expect(screen.getByText('Test Description')).toHaveClass('carousel-description');
    });

    it('renders without badge when not provided', () => {
        const promotionWithoutBadge = { ...mockPromotion, badge: undefined };
        const { container } = render(<PromotionCard promotion={promotionWithoutBadge} />);
        const badges = container.getElementsByClassName('carousel-badge');
        expect(badges.length).toBe(0);
    });
});
