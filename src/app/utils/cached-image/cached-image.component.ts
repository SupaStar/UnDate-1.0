/* eslint-disable no-underscore-dangle */
import { Component, OnInit, Input } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
//const { Filesystem } = FilesystemPlugin;

const CACHE_FOLDER = 'CACHED-IMG';
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'cached-img',
  templateUrl: './cached-image.component.html',
  styleUrls: ['./cached-image.component.scss'],
})
export class CachedImageComponent {
  _src = '';
  @Input() spinner = false;
  constructor() {}

  @Input()
  set src(imageUrl: string) {
    console.log('ImageUrl', imageUrl);
    const imageName = imageUrl.split('/').pop();
    const fileType = imageName.split('.').pop();
    Filesystem.readFile({
      directory: Directory.Cache,
      path: `${CACHE_FOLDER}/${imageName}`,
    })
      .then((readFile) => {
        console.log('Path', readFile);
        this._src = `data:image/${fileType};base64,${readFile.data}`;
      })
      .catch(async (e) => {
        await this.storeImage(imageUrl, imageName);
        Filesystem.readFile({
          directory: Directory.Cache,
          path: `${CACHE_FOLDER}/${imageName}`,
        }).then((readFile) => {
          this._src = `data:image/${fileType};base64,${readFile.data}`;
        });
      });
  }
  async storeImage(url, path) {
    //Fetch con cors
    const response = await fetch(url);
    console.log('Response', response);
    const blob = await response.blob();
    const base64Data = (await this.convertBlobToBase64(blob)) as string;
    const savedFile = await Filesystem.writeFile({
      path: `${CACHE_FOLDER}/${path}`,
      data: base64Data,
      directory: Directory.Cache,
    });
    return savedFile;
  }
  convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
  }
}
