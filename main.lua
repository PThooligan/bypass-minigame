loopanim = false
local sent, prop = 0, nil

RegisterNUICallback('closebypass', function(data)
	sent = tonumber(data)
end)

exports("startbypass", function(dificulty)
	sent = 0
	SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'startbypass',
        dif    = dificulty
    })
	if prop ~= nil then
        DeleteObject(prop)
        prop = nil
    end
    local Player = GetPlayerPed(-1)
    RequestModel(`prop_police_phone`)
    while not HasModelLoaded(`prop_police_phone`) do
        Citizen.Wait(1)
    end
    prop = CreateObject(`prop_police_phone`, 1.0, 1.0, 1.0, 1, 1, 1)
    AttachEntityToEntity(prop, Player, GetPedBoneIndex(Player, 28422), 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 1, 0, 0, 2, 1)
	loopanim = true
	PlayAnim("anim@heists@humane_labs@emp@hack_door", "hack_loop", 8.0, 8.0, -1, 1)
	while sent == 0 do
    	Citizen.Wait(10)
    end
    if sent == 3 then
        exports["notification"]:notification("Action canceled", 1)
    end
    SetNuiFocus(false, false)
	loopanim = false
	if prop ~= nil then
		DeleteObject(prop)
		prop = nil
	end
    return sent
end)

function PlayAnim(dict, anim, p1, p2, p3, p4)
    Citizen.CreateThread(function()
        while loopanim do
            Citizen.Wait(0)
            if not IsEntityPlayingAnim(GetPlayerPed(-1), dict, anim, 3) then
                RequestAnimDict(dict)
                while not HasAnimDictLoaded(dict) do
                    Citizen.Wait(10)
                end
                TaskPlayAnim(GetPlayerPed(-1), dict, anim, p1, p2, p3, p4, 0, false, false, false)
            end
        end
        StopAnimTask(GetPlayerPed(-1), dict, anim, 1.0)
    end)
end