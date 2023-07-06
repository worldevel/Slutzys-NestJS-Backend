import { Module, forwardRef } from '@nestjs/common';
import { MongoDBModule, AgendaModule } from 'src/kernel';
import { UtilsModule } from 'src/modules/utils/utils.module';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionModule } from '../subscription/subscription.module';
import { performerProviders } from './providers';
import {
  PerformerService,
  PerformerSearchService
} from './services';
import {
  AdminPerformerController,
  PerformerController
} from './controllers';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';
import { PerformerAssetsModule } from '../performer-assets/performer-assets.module';
import {
  PerformerAssetsListener, PerformerConnectedListener, UpdatePerformerStatusListener
} from './listeners';
import { MailerModule } from '../mailer/mailer.module';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [
    MongoDBModule,
    AgendaModule.register(),
    forwardRef(() => UserModule),
    forwardRef(() => AuthModule),
    forwardRef(() => FileModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => PerformerAssetsModule),
    forwardRef(() => UtilsModule),
    forwardRef(() => MailerModule),
    forwardRef(() => BlockModule)
  ],
  providers: [
    ...performerProviders,
    PerformerService,
    PerformerSearchService,
    PerformerAssetsListener,
    PerformerConnectedListener,
    UpdatePerformerStatusListener
  ],
  controllers: [
    AdminPerformerController,
    PerformerController
  ],
  exports: [
    ...performerProviders,
    PerformerService,
    PerformerSearchService
  ]
})
export class PerformerModule {}
