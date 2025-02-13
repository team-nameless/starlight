from time import sleep
from typing import TypedDict
from neurosdk.scanner import Scanner
from neurosdk.sensor import Sensor, SensorCommand, SensorFamily, BrainBitSignalData


class BrainbitSensors(TypedDict):
    O1: float
    O2: float
    T3: float
    T4: float


data_set: list[BrainbitSensors] = []


def on_brainbit_signal_data(_: Sensor, data: BrainBitSignalData) -> None:
    data_set.append({"O1": data.O1, "O2": data.O2, "T3": data.T3, "T4": data.T4})


# TODO: Cache the MAC address to connect directly?
scanner = Scanner([SensorFamily.LEBrainBit2, SensorFamily.LEBrainBitPro])

scanner.start()
sleep(5)
scanner.stop()

# scanner.sensorsChanged = sensor_found

sensors = scanner.sensors()
sensor_info = sensors[0]
sensor = scanner.create_sensor(sensor_info)

# TODO: receive thru WS server.
song_duration = 120  # seconds
max_sample_count = song_duration * 0.7
sample_count = 0

sensor.exec_command(SensorCommand.StartCalibrateSignal)

# Not sure why this is non-existent.
# https://sdk.brainbit.com/sdk2_bb/
# sensor.signalDataReceived = on_brainbit_signal_data

while sample_count < max_sample_count:
    sensor.exec_command(SensorCommand.StartSignalAndResist)
    sample_count += 1
    sensor.exec_command(SensorCommand.StopSignalAndResist)
    sleep(1)

# Not sure why this is non-existent.
# https://sdk.brainbit.com/sdk2_bb/
# sensor.signalDataReceived = None

sensor.disconnect()
del sensor
del scanner
