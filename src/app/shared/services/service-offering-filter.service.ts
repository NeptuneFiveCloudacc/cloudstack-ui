import { Injectable } from '@angular/core';
import { ServiceOffering } from '../models/service-offering.model';
import { ResourceUsageService } from './resource-usage.service';
import { ServiceOfferingService } from './service-offering.service';
import { Observable } from 'rxjs/Rx';


@Injectable()
export class ServiceOfferingFilterService {
  constructor(
    private resourceUsageService: ResourceUsageService,
    private serviceOfferingService: ServiceOfferingService
  ) { }

  public getAvailable(params?: any): Observable<Array<ServiceOffering>> {
    return Observable.forkJoin([
      this.serviceOfferingService.getList(params),
      this.resourceUsageService.getResourceUsage()
    ])
      .map(([serviceOfferings, resourceUsage]) => {
        let sos = serviceOfferings.filter(elem => {
          return resourceUsage.available.cpus >= elem.cpuNumber &&
            resourceUsage.available.memory >= elem.memory;
        });
        if (sos.length) {
          return sos;
        }
        throw new Error();
      });
  }
}
