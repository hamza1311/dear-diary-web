// ./pages/api/login
import {setAuthCookies} from 'next-firebase-auth'
import initAuth from '../../utils/initAuth'
import {NextApiRequest, NextApiResponse} from "next"; // the module you created above

initAuth()

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        await setAuthCookies(req, res)
    } catch (e) {
        console.error(e)
        return res.status(500).json({error: 'Unexpected error.'})
    }
    return res.status(200).json({success: true})
}

export default handler
