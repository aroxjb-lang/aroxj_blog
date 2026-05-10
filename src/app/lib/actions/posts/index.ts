'use server';
import 'server-only';
import dbConnect from '../../mongoose';
import {PostInterface} from '../../schemas';
import Contents from '../../models/postModel';

export async function getPostByID(post_id: string): Promise<PostInterface> {
    await dbConnect();
    const postByID = await Contents.findOneAndUpdate({slug: post_id}, {$inc: {views: 1}}, {new: true});
    return JSON.parse(JSON.stringify(postByID));
}

export async function deletePost(post_id: string): Promise<PostInterface> {
    await dbConnect();
    const postByID = await Contents.findOneAndDelete({slug: post_id});

    return JSON.parse(JSON.stringify(postByID));
}

export async function getTopPost({
                                     limit = 20, page = 1, search, sort = 'desc', category = '',
                                 }: {
    limit?: number; page?: number; search?: string; sort?: 'asc' | 'desc'; category?: string;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    await dbConnect();

    const filter: any = {
        $and: [
            {$or: [{publishing_date: {$exists: false}}, {publishing_date: {$lt: new Date()}}]},
        ],
    };
    if (category) filter.category = category;

    const s = search?.trim();
    if (s) {
        filter.$and.push({
            $or: [{'title.en': {$regex: s, $options: 'i'}}, {
                'title.am': {
                    $regex: s, $options: 'i',
                },
            }, {'title.ru': {$regex: s, $options: 'i'}}, {hashtags: {$in: [new RegExp(s, 'i')]}}],
        });
    }
    filter.$and.push({date: {$lt: new Date().toISOString(), $gte: date.toISOString()}});
    // list page-ի համար դաշտերը փոքրացրու
    const projection = {
        title: 1,
        slug: 1,
        date: 1,
        category: 1,
        hashtags: 1,
        featured_media_paths: 1,
        video_url: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        content: 1,
        publishing_date: 1,

    };

    const dir = sort === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([Contents.find(filter, projection)
        .sort({date: dir})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), Contents.countDocuments(filter)]);

    return {
        data: items as unknown as PostInterface[], pagesCount: Math.ceil(total / limit),
    };
}

export async function getPosts({
                                   limit = 20, page = 1, search, sort = 'desc', category = '',
                               }: {
    limit?: number; page?: number; search?: string; sort?: 'asc' | 'desc'; category?: string;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
    await dbConnect();

    const filter: any = {
        $and: [{
            $or: [{publishing_date: {$exists: false}}, {publishing_date: {$lt: new Date()}}],
        }],
    };

    if (category) {
        filter.category = category;
    }

    const s = search?.trim();

    if (s) {
        filter.$and.push({
            $or: [{'title.en': {$regex: s, $options: 'i'}}, {
                'title.am': {
                    $regex: s, $options: 'i',
                },
            }, {'title.ru': {$regex: s, $options: 'i'}}, {hashtags: {$in: [new RegExp(s, 'i')]}}],
        });
    }

    // list page-ի համար դաշտերը փոքրացրու
    const projection = {
        title: 1,
        slug: 1,
        date: 1,
        category: 1,
        hashtags: 1,
        featured_media_paths: 1,
        video_url: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        content: 1,
        publishing_date: 1,
    };

    const dir = sort === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([Contents.find(filter, projection)
        .sort({date: dir})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), Contents.countDocuments(filter)]);

    return {
        data: items as unknown as PostInterface[], pagesCount: Math.ceil(total / limit),
    };
}

export async function getAllPosts({
                                      limit = 20, page = 1, search, sort = 'desc', category = '',
                                  }: {
    limit?: number; page?: number; search?: string; sort?: 'asc' | 'desc'; category?: string;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
    await dbConnect();

    const filter: any = {};

    const s = search?.trim();

    if (s) {
        filter.$or = [{'title.en': {$regex: s, $options: 'i'}}, {'title.am': {$regex: s, $options: 'i'}}, {
            'title.ru': {
                $regex: s, $options: 'i',
            },
        }, {hashtags: {$in: [new RegExp(s, 'i')]}}];

    }

    // list page-ի համար դաշտերը փոքրացրու
    const projection = {
        title: 1,
        slug: 1,
        date: 1,
        category: 1,
        hashtags: 1,
        featured_media_paths: 1,
        video_url: 1,
        views: 1,
        createdAt: 1,
        updatedAt: 1,
        content: 1,
        publishing_date: 1,
    };

    const dir = sort === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([Contents.find(filter, projection)
        .sort({date: dir})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), Contents.countDocuments(filter)]);

    return {
        data: items as unknown as PostInterface[], pagesCount: Math.ceil(total / limit),
    };
}

export async function getArchive({
                                     limit = 20, page = 1, search, sort = 'desc', category = '',
                                 }: {
    limit?: number; page?: number; search?: string; sort?: 'asc' | 'desc'; category?: string;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
    await dbConnect();

    const cutoff = new Date();
    cutoff.setMonth(cutoff.getMonth() - 3);

    const filter: any = {
        $and: [{
            $or: [{publishing_date: {$exists: false}}, {publishing_date: {$lt: new Date()}}],
        }],
    };

    if (category) {
        filter.category = category;
    }

    const s = search?.trim();

    if (s) {
        filter.$and.push({
            $or: [{'title.en': {$regex: s, $options: 'i'}}, {
                'title.am': {
                    $regex: s, $options: 'i',
                },
            }, {'title.ru': {$regex: s, $options: 'i'}}, {hashtags: {$in: [new RegExp(s, 'i')]}}],
        });
    }
    const dir = sort === 'desc' ? -1 : 1;

    const [items, total] = await Promise.all([Contents.find(filter)
        .sort({date: dir})
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(), Contents.countDocuments(filter)]);

    return {
        data: items.map((doc: any) => {
            if (!doc._id) return;
            return {
                ...doc, _id: doc._id?.toString(), date: doc.date?.toISOString?.() ?? doc.date,
            };
        }), pagesCount: Math.ceil(total / limit),
    };
}

export async function getMostViewedPost({
                                            limit = 20, page = 1,
                                        }: {
    limit?: number; page?: number;
}): Promise<{ data: PostInterface[]; pagesCount: number }> {
    const date = new Date();
    date.setMonth(date.getMonth() - 3);
    await dbConnect();
    const topPost = await Contents.find({
        $and: [{date: {$lt: new Date().toISOString(), $gte: date.toISOString()}}, {
            $or: [{publishing_date: {$exists: false}}, {publishing_date: {$lt: new Date()}}],

        }],
    })
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({views: 'desc'});
    const pagesCount = await Contents.countDocuments({
        date: {$lt: new Date().toISOString(), $gte: date.toISOString()}, category: 'post',
    });
    const data = {
        data: JSON.parse(JSON.stringify(topPost)), pagesCount: Math.ceil(pagesCount / limit),
    };
    return data;
}

export async function updatePostByID(post_id: string, data: Partial<PostInterface>): Promise<PostInterface> {
    await dbConnect();
    const postByID = await Contents.findOneAndUpdate({slug: post_id}, data, {
        new: true,
    });

    return JSON.parse(JSON.stringify(postByID));
}

export async function createPost(data: Partial<PostInterface>): Promise<PostInterface> {
    await dbConnect();
    const postByID = await Contents.create(data);
    return JSON.parse(JSON.stringify(postByID));
}
