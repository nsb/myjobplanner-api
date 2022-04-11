export interface IService<Insertable, Updatable, Selectable> {
    create (userId: string, insertable: Insertable, businessId?: number): Promise<Selectable>
    update (userId: string, id: number, business: Updatable, businessId?: number): Promise<Selectable>
}
