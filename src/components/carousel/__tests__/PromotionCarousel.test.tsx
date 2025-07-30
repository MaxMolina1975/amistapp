import { render, screen } from '@testing-library/react';
import { PromotionCarousel } from '../components/PromotionCarousel';
import { promotions } from '../data/promotions';
import { Promotion } from '../../../lib/types';

// Mock Swiper components
jest.mock('swiper/react', () => ({
    Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper">{children}</div>,
    SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>,
}));

jest.mock('swiper/modules', () => ({
    Pagination: jest.fn(),
    Autoplay: jest.fn(),
}));

describe('PromotionCarousel', () => {
    const customPromotions: Promotion[] = [
        {
            id: 999,
            title: "Test Promotion",
            description: "Test Description",
            imageUrl: "test-image.jpg",
            category: 'feature',
            badge: 'Test'
        }
    ];

    it('renders without crashing', () => {
        render(<PromotionCarousel />);
        expect(screen.getByTestId('swiper')).toBeInTheDocument();
    });

    it('renders default promotions correctly', () => {
        render(<PromotionCarousel />);
        promotions.forEach(promo => {
            expect(screen.getByText(promo.title)).toBeInTheDocument();
            expect(screen.getByText(promo.description)).toBeInTheDocument();
        });
    });

    it('renders custom promotions when provided', () => {
        render(<PromotionCarousel promotions={customPromotions} />);
        expect(screen.getByText('Test Promotion')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('renders badges when provided', () => {
        render(<PromotionCarousel promotions={customPromotions} />);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
        const { container } = render(<PromotionCarousel className="custom-class" />);
        expect(container.firstChild).toHaveClass('custom-class');
    });
});
