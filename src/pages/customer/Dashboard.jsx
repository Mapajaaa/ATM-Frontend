import React, { useEffect, useState } from 'react'
import { AuthContext } from '../../AuthContext';
import { useNavigate } from 'react-router-dom';


export default function Dashboard() {
    const [data, setData] = useState('')
    const [Rek, setRekening] = useState('')
    const apiUrl = process.env.REACT_APP_API_URL
    const { isCustAuthenticated, idC, logoutC } = React.useContext(AuthContext);
    console.log(idC);
    const history = useNavigate();

    if (!isCustAuthenticated) {
        history('/login');
    }

    useEffect(() => {
        setData(idC)
        const fetchData = async () => {
            try {
                const response = await fetch(`${apiUrl}/cek-rek`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ NoKartu: data.NoKartu }), // Kirim PIN sebagai bagian dari data JSON
                });
              const datas = await response.json();
              setRekening(datas.Saldo);
              console.log(datas);
            } catch (error) {
              console.error('Error:', error);
            }
        }
        fetchData();
    });

    function transfer() {
        history('/transfer');
    }
    function tarik() {
        history('/tarik');
    }
    return (
        <div className='flex'>
            <div className='h-screen'>
                <div className='bg-blue-700 w-screen h-1/2 rounded-3xl rounded-t-none'>
                    <div className='p-4 font-extrabold text-4xl text-white justify-between flex z-50'>
                        <div>
                            ATM {data.NamaBank}
                        </div>
                        <div>
                            <a class="btn  text-white ms-4 hover:bg-sky-900" onClick={logoutC}>Sign Out</a>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex '>
                <div className='bg-blue-900 w-5/6 h-2/3 -translate-x-[91dvw] absolute self-center rounded-2xl shadow-black shadow-lg'>
                    <div className='p-4 text-white font-medium text-2xl'>
                        Saldo Rekening
                    </div>
                    <div className='px-4 text-white font-bold text-6xl'>
                        Rp {Rek},00
                    </div>
                    <div className='w-full h-2/5 rounded-2xl bg-blue-950 mt-24 flex px-36 justify-between text-white items-center'>
                        <div className='bg-blue-900 p-3 rounded-lg font-bold cursor-pointer' >
                            <button onClick={transfer}>Transfer</button>

                        </div>
                        <div className='bg-blue-900 p-3 rounded-lg font-bold cursor-pointer'>
                        <button onClick={tarik}>Tarik Tunai</button>
                        </div>
                        <div className='bg-blue-900 p-3 rounded-lg font-bold cursor-pointer'>
                            Setor Tunai
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
