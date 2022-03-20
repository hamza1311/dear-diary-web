// ./pages/api/logout
import { unsetAuthCookies } from 'next-firebase-auth'
import initAuth from '../../utils/initAuth'
import {NextApiRequest, NextApiResponse} from "next"; // the module you created above

initAuth('logout.ts')

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await unsetAuthCookies(req, res)
    } catch (e) {
        return res.status(500).json({ error: 'Unexpected error.' })
    }
    return res.status(200).json({ success: true })
}

export default handler
