import User from '@models/User';
import { body, validationResult } from 'express-validator';
import gravatar from 'gravatar';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser, IUser } from '@/interfaces/users.interface';
import { sendMail } from '@utils/sendMail';

export const get_get_user = async (req: RequestWithUser, res: Response) => {
    const { password, resetPassword, refreshToken, ...data } = req.user._doc;
    res.json(data)
}

export const post_create_user = [

    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isLength({ min: 6 }),

    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password, img } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {
            try {
                const found_user = await User.findOne({ email: email });
                if (found_user) return res.status(409).json({ msg: 'User already exists' });
                const avatar = gravatar.url(email, { s: '100', r: 'pg', d: 'retro' }, true);
                const user = new User({
                    email: email,
                    password: password,
                    name: email.split('@')[0],
                    avatar: avatar || img || ''
                });
                await user.save();
                const mailOptions: [string, string, string, string] = [
                    email,
                    'Account Creation',
                    `Welcome to Twitee`,
                    `<p>Dear ${email.split('@')[0]}, Welcome to the Twitee platform, we are glad to have you onboard</p>`
                ];
                await sendMail(...mailOptions);
                res.json({ msg: "Success!!!" })
            } catch (err) {
                return next(err);
            }
        }
    }
];

export const put_update_user = [
    async (req: Request, res: Response, next: NextFunction) => {
        res.send('Not yet implemented')
    }
]

export const delete_delete_user = async (req: Request, res: Response, next: NextFunction) => {
    res.send('Not yet implemented')
}