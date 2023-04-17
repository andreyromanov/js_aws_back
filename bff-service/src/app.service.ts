import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { Request } from 'express';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}
  async proxyRequest(request: Request): Promise<string> {
    try {
      const { url, method, query, body, headers } = request;
      const requestedService = url.split('/')[1];
      const serviceUrl = process.env[requestedService];
      const requestParams = {
        method, 
        url: serviceUrl,
        header: headers?.authorization
      }

      if (serviceUrl) {
        if(requestedService === 'products'){
          const products = await this.cacheManager.get('products');
          if (!products) {
            const { data } = await this.request(requestParams);
            await this.cacheManager.set('products', data, 120000);
            return data;
          }
          return products as string;
        }
        const result = await this.request(requestParams);

        return result.data;
      } else {
        throw new Error("Url not valid");
      }

    } catch (error) {
      throw new Error(error.message);
    }
  }

  private async request(params: {method: string, url: string, header: string}) {
    return axios({
      method: params.method,
      url: params.url,  
      headers:{
        Authorization: params.header
      }
    });
  }
}
