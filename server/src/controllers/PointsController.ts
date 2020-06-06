import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController{
    
    async index(request: Request, response: Response){
        //cidade, uf, items (Query Params)
        const { city, uf, items} = request.query;

        const parsedItems = String(items)
        .split(',')
        .map(item => Number(item.trim()));

        const points = await knex('point')
        .join('point_item', 'point.id', '=', 'point_item.point_id')
        .whereIn('point_item.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('point.*');

        const serializedPoints = points.map(point => {
            return {
                ...point,
                image_url: `http://192.168.100.103:3333/uploads/${point.image}`
            };
        });
    
        return response.json(serializedPoints);
    }

    async show(request: Request, response: Response){
        const { id } = request.params;//Desestruturação

        const point = await knex('point').where('id', id).first();

        if(!point){
            return response.status(400).json({ message: 'Point not found.' });
        }

        const serializedPoint = {          
            ...point,
            image_url: `http://192.168.100.103:3333/uploads/${point.image}`        
        };

        const items = await knex('item')
        .join('point_item', 'item.id', '=','point_item.item_id')
        .where('point_item.point_id', id)
        .select('item.title');

        return response.json({ point: serializedPoint, items });
    }

    async create(request: Request, response: Response) {
        const { 
            name,
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf,
            items
        } = request.body;//recurso de desestruturação
    
        const trx = await knex.transaction();//caso qualquer uma das query falhar, o app dara rollback em todas
    
        const point = {
            image: request.file.filename,
            name,//short sintaxe
            email,
            whatsapp,
            latitude,
            longitude,
            city,
            uf
        };

        const insertedIds = await trx('point').insert(point);
    
        const point_id = insertedIds[0];
    
        const pointItems = items
        .split(',')
        .map((item: string) => Number(item.trim()))
        .map((item_id: number) => {
            return {
                item_id,
                point_id,
            };
        });
    
        await trx('point_item').insert(pointItems);
    
        await trx.commit();//efetiva as operações

        return response.json({ 
            id: point_id,
            ...point,
         });
    }
}

export default PointsController;