'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { User } from '@prisma/client'
import { ConversationType, MessageType } from '@/app/types'
import Avatar from 'react-avatar'
import { useParams, useRouter } from 'next/navigation'
import { TiGroup } from 'react-icons/ti'
import dayjs from 'dayjs'
import calendar from 'dayjs/plugin/calendar'
import { useAppSelector } from '@/app/redux/hooks'
dayjs.extend(calendar)

const UserBox = ({ conversation }: { conversation: ConversationType }) => {

  const { user, mode } = useAppSelector((state) => state.user)
  const [otherUser, setOtherUser] = useState<User>()

  const [time, setTime] = useState<string>()
  const [lastMessage, setLastMessage] = useState<string | null>('')
  const [lastMessageData, setLastMessageData] = useState<MessageType>();
  const [hasSeen, setHasSeen] = useState<boolean>();

  useEffect(() => {
    setLastMessage('')
    if (conversation.messages && conversation.messages.length > 0) {
      if (conversation.messages) {
        setLastMessageData(conversation.messages[0]);
        if (conversation.messages[0].image) {
          setLastMessage('Image')
        } else {
          setLastMessage(conversation.messages[0].text)
        }
      }
    }
    const userData = conversation.users.filter((u: any) => u.id !== user?.id)
    setOtherUser(userData[0])
  }, [conversation])
  useEffect(() => {
    if (lastMessage) {
      let data = dayjs(conversation.lastMessageAt).calendar(null, {
        sameDay: 'h:mm A',
        lastDay: '[Yesterday]',
        lastWeek: 'dddd',
        sameElse: 'DD/MM/YYYY'
      })
      setTime(data)
    }
  }, [lastMessage])
  useEffect(() => {
    if (lastMessageData && user) {
      let messages = lastMessageData.seenUserIds.filter((id) => id === user.id)
      if (messages.length === 0)
        setHasSeen(false);
      else
        setHasSeen(true);
    }
  }, [lastMessageData])
  const router = useRouter()
  const params = useParams()
  const handleClick = () => {
    router.push(`/chats/${conversation.id}`)
  }
  return (
    <div className={`relative flex gap-3 items-center border-b border-b-light1 py-3 px-2 hover:bg-b-light1 hover:bg-opacity-10 cursor-pointer ${params.chatId && params.chatId === conversation.id ? 'md:bg-b-light1 md:bg-opacity-20' : ''}`} onClick={() => handleClick()}>
      {otherUser && !conversation.isGroup && <>
        {otherUser.image ? <Image src={otherUser?.image} height={38} width={38} className='rounded-full w-[38px] h-[38px]' alt={conversation.name || 'conversation'} /> :
          otherUser.name && <Avatar name={otherUser.name} size='38' round style={{ fontSize: '15px' }} />}
      </>}
      {conversation.isGroup &&
        <div className={`flex items-center justify-center h-[38px] w-[38px] rounded-full transition-colors duration-300 ease-in-out  bg-opacity-40  p-1.5 ${mode && mode === 'light' ? 'text-text-light-1 bg-b-light1' : 'bg-light-1 text-white'}`}>
          <TiGroup size={28} />
        </div>}
      {otherUser && <div className='md:w-5/6 sm:w-11/12 w-5/6'>
        <div className='flex justify-between items-center gap-10 w-full'>
          {!conversation.isGroup ? <h5 className={`truncate transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'text-black' : 'text-white'}`}>{otherUser.name}</h5> :
            <h5 className={`truncate transition-colors duration-300 ease-in-out ${mode && mode === 'light' ? 'text-black' : 'text-white'}`}>{conversation.name}</h5>}
          {time && conversation.messages && conversation.messages.length > 0 && <div className='text-gray-400  text-xs font-sans flex items-center gap-2'>
            {!hasSeen && <span title='New Message' className='h-2 w-2 rounded-full bg-[#6d94c6]'></span>}
            <span title='Time'>{time}</span>
          </div>}
        </div>
        {lastMessage ? <p className={`text-xs transition-colors duration-300 ease-in-out  truncate max-w-[60%] ${mode && mode === 'light' ? 'text-black' : 'text-white'} ${!hasSeen ? 'font-medium' : ''}`}>{lastMessage}</p> : <p className='text-xs text-gray-500'>Started Conversation</p>}
      </div>}

    </div>
  )
}

export default UserBox