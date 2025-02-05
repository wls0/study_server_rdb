import { Global, Module } from '@nestjs/common';
import { JwtUserGuard } from './jwt.guard';
import { JwtService } from './jwt.service';
import { JwtUserStrategy } from './jwt.strategy';
import { User } from '../../model/user.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [JwtService, JwtUserGuard, JwtUserStrategy],
  exports: [JwtService],
})
export class JwtModule {}
