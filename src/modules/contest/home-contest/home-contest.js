import { inject, observable } from 'aurelia-framework'

import { MESSAGES } from 'config/config'
import { Contest } from 'models/models'
import { Alert, Auth, Contests } from 'services/services'

/**
 * HomeContest (Module)
 * Módulo encargado de manejar las maratones de programación
 * @export
 * @class HomeContest
 */

// dependencias a inyectar: Servicio de notificaciones (Alert),
// Servicio de Autenticación (Auth), servicio de maratones (Contests)
@inject(Alert, Auth, Contests)
export class HomeContest {
  // Elementos observables.
  @observable pageMyContests;

  @observable pageAllContests;

  @observable filterChangeMyContests;

  @observable filterChangeAllContests;

  /**
   * Inicializa una instancia de HomeContest.
   */
  constructor (alertService, authService, contestService) {
    this.alertService = alertService
    this.authService = authService
    this.contestService = contestService
    this.numberOfItems = [10, 15, 20]
    this.sortOptions = ['Id', 'Nombre']
    this.filterChangeMyContests = false
    this.limitMyContests = 10
    this.sortMyContests = 'Id'
    this.byMyContests = 'Ascendente'
    this.pageMyContests = 1
    this.totalPagesMyContests = 1;
    this.filterChangeAllContests = false
    this.limitAllContests = 10
    this.sortAllContests = 'Id'
    this.byAllContests = 'Ascendente'
    this.pageAllContests = 1
    this.totalPagesAllContests = 1;
    this.myContests = []
    this.allContests = []
    this.getMyContests()
    this.getContests()
  }

  /**
   * Cuando cambia un filtro, obtiene los usuarios con los nuevos parametros.
   * @param {bool} act - Nuevo estado 
   * @param {bool} prev - Antiguo estado
   */
   filterChangeMyContestsChanged (act, prev) {
    if(prev !== undefined) this.getMyContests();
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageMyContestsChanged (act, prev) {
    if (prev !== undefined) this.getMyContests();
  }

  /**
   * Cuando cambia un filtro, obtiene los usuarios con los nuevos parametros.
   * @param {bool} act - Nuevo estado 
   * @param {bool} prev - Antiguo estado
   */
   filterChangeAllContestsChanged (act, prev) {
    if(prev !== undefined) this.getContests();
  }

  /**
   * Detecta cuando el número de página es modificado para solicitar el nuevo número.
   * @param {Number} act - Número de página nuevo.
   * @param {Number} prev - Número de página antes del cambio
   */
  pageAllContestsChanged (act, prev) {
    if (prev !== undefined) this.getContests();
  }

  /**
   * Obtiene todas las maratones de programación creadas por el usuario
   * actualmente logueado.
   */
  getMyContests () {
    this.contestService.getMyContests(this.limitMyContests, this.pageMyContests, this.authService.getUserId())
      .then(data => {
        this.totalPagesMyContests = data.meta.totalPages
        this.myContests = []
        if(this.totalPagesMyContests > 0) {
          for (let i = 0; i < data.data.length; i++) {
            this.myContests.push(new Contest(data.data[i].title, data.data[i].description, data.data[i].init_date, data.data[i].end_date, data.data[i].rules, data.data[i].public, undefined, data.data[i].id))
          }
        }
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  /**
   * Obtiene todas las maratones de programación próximas.
   */
  getContests () {
    this.contestService.getContests(this.limitAllContests, this.pageAllContests)
      .then(data => {
        this.totalPagesAllContests = data.meta.totalPages
        this.allContests = []
        if(this.totalPagesAllContests > 0) {
          for (let i = 0; i < data.data.length; i++) {
            this.allContests.push(new Contest(data.data[i].title, data.data[i].description, data.data[i].init_date, data.data[i].end_date, data.data[i].rules, data.data[i].public, undefined, data.data[i].id))
          }
        }
      })
      .catch(error => {
        if (error.status === 400) {
          this.alertService.showMessage(MESSAGES.contestError)
        } else if (error.status === 401) {
          this.alertService.showMessage(MESSAGES.permissionsError)
        } else {
          this.alertService.showMessage(MESSAGES.unknownError)
        }
      })
  }

  showMessage () {
    this.alertService.showMessage(MESSAGES.temporarilyDisabled)
  }
}
