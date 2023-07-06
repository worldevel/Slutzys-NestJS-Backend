import { QueueEventService, QueueEvent } from 'src/kernel';
import { PerformerService } from 'src/modules/performer/services';
import { GalleryService, ProductService, VideoService } from '../services';
export declare class ReactionAssetsListener {
    private readonly performerService;
    private readonly queueEventService;
    private readonly videoService;
    private readonly galleryService;
    private readonly productService;
    constructor(performerService: PerformerService, queueEventService: QueueEventService, videoService: VideoService, galleryService: GalleryService, productService: ProductService);
    handleReaction(event: QueueEvent): Promise<void>;
}
