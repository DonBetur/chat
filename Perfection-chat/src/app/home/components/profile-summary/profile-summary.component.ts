import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
// import { FileTypeResult } from 'file-type';
// import { fromBuffer } from 'file-type/core';
import { BehaviorSubject, from, Observable, of, Subscription } from 'rxjs';
import { take, tap } from 'rxjs/operators';

import { Role, User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { BannerColorService } from '../../services/banner-color.service';

// type validFileExtension = 'png' | 'jpg' | 'jpeg';
// type validMimeType = 'image/png' | 'image/jpg' | 'image/jpeg';

@Component({
  selector: 'app-profile-summary',
  templateUrl: './profile-summary.component.html',
  styleUrls: ['./profile-summary.component.scss'],
})
export class ProfileSummaryComponent implements OnInit{
  form: UntypedFormGroup;

  // validFileExtensions: validFileExtension[] = ['png', 'jpg', 'jpeg'];
  // validMimeTypes: validMimeType[] = ['image/png', 'image/jpg', 'image/jpeg'];

  userFullImagePath: string;
  // private userImagePathSubscription: Subscription;

	user$: Observable<User> = this.authService.userStream.pipe(
		tap((user) => {
			this.bannerColorService.bannerColors = this.bannerColorService.getBannerColors(user.role);
		})
	);

  constructor(
    private authService: AuthService,
    public bannerColorService: BannerColorService
  ) {}

  ngOnInit() {
    this.form = new UntypedFormGroup({
      file: new UntypedFormControl(null),
    });

  //   this.userImagePathSubscription =
  //     this.authService.userFullImagePath.subscribe((fullImagePath: string) => {
  //       this.userFullImagePath = fullImagePath;
  //     });
  // }

  // onFileSelect(event: Event): void {
  //   const file: File = (event.target as HTMLInputElement).files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append('file', file);

  //   from(file.arrayBuffer())
  //     .pipe(
  //       switchMap((buffer: Buffer) => {
  //         return from(fromBuffer(buffer)).pipe(
  //           switchMap((fileTypeResult: FileTypeResult) => {
  //             if (!fileTypeResult) {
  //               // TODO: error handling
  //               console.log({ error: 'file format not supported!' });
  //               return of();
  //             }
  //             const { ext, mime } = fileTypeResult;
  //             const isFileTypeLegit = this.validFileExtensions.includes(
  //               ext as any
  //             );
  //             const isMimeTypeLegit = this.validMimeTypes.includes(mime as any);
  //             const isFileLegit = isFileTypeLegit && isMimeTypeLegit;
  //             if (!isFileLegit) {
  //               // TODO: error handling
  //               console.log({
  //                 error: 'file format does not match file extension!',
  //               });
  //               return of();
  //             }
  //             return this.authService.uploadUserImage(formData);
  //           })
  //         );
  //       })
  //     )
  //     .subscribe();

  //   this.form.reset();
  // }

  // ngOnDestroy() {
      //  this.userSubscription.unsubscribe();
  //   this.userImagePathSubscription.unsubscribe();
  // }
    }
}
