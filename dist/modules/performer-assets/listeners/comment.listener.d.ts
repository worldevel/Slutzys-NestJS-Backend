import { QueueEventService, QueueEvent } from 'src/kernel';
import { VideoService } from '../services/video.service';
import { GalleryService, ProductService } from '../services';
export declare class CommentAssetsListener {
    private readonly queueEventService;
    private readonly videoService;
    private readonly productService;
    private readonly galleryService;
    constructor(queueEventService: QueueEventService, videoService: VideoService, productService: ProductService, galleryService: GalleryService);
    handleComment(event: QueueEvent): Promise<void>;
}
